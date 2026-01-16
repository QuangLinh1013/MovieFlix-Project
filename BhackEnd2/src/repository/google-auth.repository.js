const connection = require('../config/database');
const crypto = require('crypto');

// 1. Tìm user theo Google ID (Giữ nguyên)
const findByGoogleId = async (googleId) => {
    const query = `
        SELECT u.* FROM users u
        JOIN social_logins s ON u.id = s.user_id
        WHERE s.provider_id = ? AND s.provider = 'google'
    `;
    const [results] = await connection.query(query, [googleId]);
    return results[0] || null;
};

// 2. Tìm user theo Email (Giữ nguyên)
const findByEmail = async (email) => {
    const [results] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    return results[0] || null;
};

// 3. LOGIC "FORCE UPDATE" (BẮT BUỘC CẬP NHẬT)
const findOrCreateGoogleUser = async ({ googleId, email, name, picture }) => {
    
    // A. Check user đã link Google chưa
    let user = await findByGoogleId(googleId);
    
    if (user) {
        // 👇 SỬA Ở ĐÂY: KHÔNG CẦN CHECK GÌ CẢ
        // Cứ thấy có ảnh từ Google gửi về là GHI ĐÈ luôn
        if (picture) {
             console.log("Repo: Bắt buộc cập nhật ảnh Google vào DB");
             await connection.query("UPDATE users SET avatar = ? WHERE id = ?", [picture, user.id]);
             user.avatar = picture; // Cập nhật biến user để trả về Frontend
        }
        return user; 
    }

    // B. Check email cũ
    user = await findByEmail(email);

    if (user) {
        // User cũ giờ mới link Google -> Thêm vào bảng social_logins
        await connection.query(
            "INSERT INTO social_logins (user_id, provider, provider_id, email) VALUES (?, 'google', ?, ?)",
            [user.id, googleId, email]
        );
        
        // 👇 SỬA Ở ĐÂY NỮA: GHI ĐÈ LUÔN
        if (picture) {
             console.log("Repo: User cũ -> Bắt buộc cập nhật ảnh Google");
             await connection.query("UPDATE users SET avatar = ? WHERE id = ?", [picture, user.id]);
             user.avatar = picture;
        }
        return user; 
    } else {
        // ==> TRƯỜNG HỢP: USER MỚI TINH (Giữ nguyên)
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const defaultRole = 'User'; 

        // User mới thì chắc chắn lấy ảnh Google rồi
        const initialAvatar = picture || "https://cdn-icons-png.flaticon.com/512/147/147144.png";

        const sql = "INSERT INTO users (username, password, email, role, avatar) VALUES (?, ?, ?, ?, ?)";
        
        const [result] = await connection.query(sql, [name, randomPassword, email, defaultRole, initialAvatar]);
        const newUserId = result.insertId;

        await connection.query(
            "INSERT INTO social_logins (user_id, provider, provider_id, email) VALUES (?, 'google', ?, ?)",
            [newUserId, googleId, email]
        );

        return { 
            id: newUserId, 
            username: name, 
            email: email, 
            role: defaultRole,
            avatar: initialAvatar 
        };
    }
};

module.exports = { findOrCreateGoogleUser };