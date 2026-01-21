const connection = require('../config/database');

// 1. Hàm tạo thông báo mới
const create = async ({ user_id, title, message, type, link }) => {
    try {
        // Mình thêm is_read = 0 và created_at = NOW() để đảm bảo dữ liệu đầy đủ
        const sql = `
            INSERT INTO notifications (user_id, title, message, type, link, is_read, created_at) 
            VALUES (?, ?, ?, ?, ?, 0, NOW())
        `;
        
        // Nếu user_id là null (gửi cho tất cả), MySQL vẫn nhận null bình thường
        const [result] = await connection.query(sql, [user_id, title, message, type || 'system', link]);
        
        return result.insertId;
        
    } catch (error) {
        console.error("Lỗi Repository Notification (create):", error);
        throw error;
    }
};

// 2. Hàm lấy danh sách thông báo
const getNotificationsByUserId = async (userId) => {
    try {
        const sql = `
            SELECT * FROM notifications 
            WHERE user_id = ? OR type = 'system' 
            ORDER BY created_at DESC 
            LIMIT 5
        `;
        
        // 👇 ĐÃ SỬA LỖI Ở ĐÂY:
        // Cũ: await connection.query(query, ...) -> SAI vì biến query không tồn tại
        // Mới: await connection.query(sql, ...)   -> ĐÚNG
        const [rows] = await connection.query(sql, [userId]);
        
        return rows;
        
    } catch (error) {
        console.error("Lỗi Repository Notification (get):", error);
        throw error;
    }
};

module.exports = { create, getNotificationsByUserId };