const connection = require('../config/database');

const create = async ({ username, password, email, role, avatar }) => {
    try {
        // 👇 ĐÃ SỬA: Thêm cột avatar vào để lúc tạo user mới có thể lưu luôn ảnh (nếu cần)
        let [results, fields] = await connection.query(
            "INSERT INTO users (username, password, email, role, avatar) VALUES (?, ?, ?, ?, ?)",
            [username, password, email, role, avatar || null] // Nếu không có avatar thì lưu null
        );
        return results; 
    } catch (error) {
        console.error("LỖI SQL KHI TẠO USER:", error);
        throw error;
    }
};

const findByUsername = async (username) => {
    try {
        let [results, fields] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return results && results.length > 0 ? results[0] : null; 
    } catch (error) {
        console.error("LỖI SQL KHI TÌM USER:", error);
        throw error;
    }
};

// 👇👇 QUAN TRỌNG: ĐÂY LÀ HÀM BẠN ĐANG THIẾU ĐỂ LOGIN HOẠT ĐỘNG ĐÚNG 👇👇
const findByEmail = async (email) => {
    try {
        // Phải dùng SELECT * để lấy cả cột 'avatar'
        let [results] = await connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return results && results.length > 0 ? results[0] : null; 
    } catch (error) {
        console.error("LỖI SQL KHI TÌM EMAIL:", error);
        throw error;
    }
};

const findAll = async () => {
    // Chỉ lấy id, username, role, email, avatar (Thêm avatar để Admin quản lý thấy ảnh luôn)
    const [results] = await connection.query(
        "SELECT id, username, role, email, avatar FROM users"
    );
    return results;
};

const deleteById = async (id) => {
    const [result] = await connection.query("DELETE FROM users WHERE id = ?", [id]);
    return result;
};

const updateAvatar = async (userId, avatarUrl) => {
    const sql = "UPDATE users SET avatar = ? WHERE id = ?";
    const [result] = await connection.query(sql, [avatarUrl, userId]);
    return result;
};

const findById = async (id) => {
    try {
        const [results] = await connection.query(
            "SELECT id, username, email, role, avatar FROM users WHERE id = ?",
            [id]
        );
        return results[0];
    } catch (error) {
        console.error("LỖI SQL KHI TÌM ID:", error);
        throw error;
    }
};

module.exports = {
    create,
    findByUsername,
    findByEmail, // 👈 NHỚ EXPORT HÀM NÀY
    findAll,
    deleteById,
    updateAvatar,
    findById
};