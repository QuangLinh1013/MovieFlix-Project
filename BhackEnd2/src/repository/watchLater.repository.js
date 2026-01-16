const connection = require('../config/database');

const watchLaterRepository = {
    // Tìm xem đã lưu chưa
    findItem: async (userId, movieId) => {
        const sql = `SELECT * FROM watch_later WHERE user_id = ? AND movie_id = ?`;
        const [rows] = await connection.execute(sql, [userId, movieId]);
        return rows[0];
    },

    // Thêm mới
    addItem: async (userId, movieId) => {
        const sql = `INSERT INTO watch_later (user_id, movie_id) VALUES (?, ?)`;
        const [result] = await connection.execute(sql, [userId, movieId]);
        return result;
    },

    // Xóa
    removeItem: async (userId, movieId) => {
        const sql = `DELETE FROM watch_later WHERE user_id = ? AND movie_id = ?`;
        const [result] = await connection.execute(sql, [userId, movieId]);
        return result;
    },

    // Lấy danh sách kèm thông tin phim
    getList: async (userId) => {
        const sql = `
            SELECT 
                w.added_at,
                m.id as movie_id, 
                m.title, 
                m.poster_path, 
                m.genre,
                m.m3u8_url
            FROM watch_later w
            JOIN movie1 m ON w.movie_id = m.id
            WHERE w.user_id = ?
            ORDER BY w.added_at DESC
        `;
        const [rows] = await connection.execute(sql, [userId]);
        return rows;
    }
};

module.exports = watchLaterRepository;