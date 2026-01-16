const connection = require('../config/database');

const saveHistory = async (userId, movieId) => {
    // Sử dụng câu lệnh INSERT ... ON DUPLICATE KEY UPDATE để cập nhật thời gian nếu đã xem
    const sql = `
        INSERT INTO watch_history (user_id, movie_id) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE watched_at = CURRENT_TIMESTAMP`;
    return await connection.execute(sql, [userId, movieId]);
};

const getHistoryByUser = async (userId) => {
    // JOIN với bảng movie1 để lấy title, poster_path, m3u8_url...
    const sql = `
        SELECT h.watched_at, m.title, m.poster_path, m.genre, m.m3u8_url, m.id as movie_id
        FROM watch_history h
        JOIN movie1 m ON h.movie_id = m.id
        WHERE h.user_id = ?
        ORDER BY h.watched_at DESC`;
    const [rows] = await connection.execute(sql, [userId]);
    return rows;
};

const deleteHistory = async (userId, movieId) => {
    // Câu lệnh SQL
    const sql = `DELETE FROM watch_history WHERE user_id = ? AND movie_id = ?`;
    
    // Thực thi và lấy kết quả
    const [result] = await connection.execute(sql, [userId, movieId]);
    
    // Trả về kết quả (để controller kiểm tra xem có xóa được dòng nào không)
    return result;
};

module.exports = { saveHistory, getHistoryByUser, deleteHistory };