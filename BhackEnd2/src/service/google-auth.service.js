const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const googleRepo = require('../repository/google-auth.repository');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const login = async (token, type) => {
    try {
        let userInfo = {};

        // --- BƯỚC 1: LẤY THÔNG TIN TỪ GOOGLE (Giữ nguyên) ---
        
        if (type === 'id_token') {
            // Trường hợp 1: Đăng nhập bằng ONE TAP (ID Token)
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            
            userInfo = {
                sub: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            };
        } else {
            // Trường hợp 2: Đăng nhập bằng NÚT BẤM (Access Token)
            const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const payload = response.data;
            
            if (!payload.email_verified) throw new Error("Email chưa xác thực");
            
            userInfo = {
                sub: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            };
        }

        // --- BƯỚC 2: GỌI REPO ĐỂ LƯU/CẬP NHẬT USER ---
        // Lưu ý: Chúng ta truyền 'userInfo.picture' xuống, nhưng Repo sẽ tự quyết định:
        // - Nếu user chưa có ảnh -> Lấy ảnh này lưu vào DB.
        // - Nếu user đã có ảnh -> Bỏ qua ảnh này, giữ ảnh cũ.
        const user = await googleRepo.findOrCreateGoogleUser({
            googleId: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture 
        });

        // --- BƯỚC 3: TẠO TOKEN ---
        // Biến 'user' ở đây là kết quả cuối cùng từ DB trả về.
        // - Nếu Repo giữ ảnh cũ -> user.avatar là ảnh cũ.
        // - Nếu Repo lấy ảnh Google -> user.avatar là ảnh Google.
        // => Token luôn chứa ảnh đúng nhất.
        const accessToken = jwt.sign(
            { 
                id: user.id, 
                role: user.role, 
                email: user.email, 
                avatar: user.avatar,
                provider: 'google'
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        return { user, accessToken };

    } catch (error) {
        console.error("Lỗi Auth Service:", error.message);
        throw new Error("Xác thực Google thất bại");
    }
};

module.exports = { login };