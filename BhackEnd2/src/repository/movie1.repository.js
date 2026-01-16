const db = require('../config/database'); // Kết nối MySQL của bạn

const createMovie = async (movieData) => {
    const sql = `
        INSERT INTO movie1 
        (title, m3u8_url, poster_path, poster_original_name, genre, duration, description, rating, is_vip) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
        movieData.title,
        movieData.m3u8_url,
        movieData.poster_path,
        movieData.poster_original_name,
        movieData.genre,
        movieData.duration,
        movieData.description,
        movieData.rating,
        movieData.is_vip
    ];

    // Thực thi câu lệnh
    const [result] = await db.execute(sql, values);
    return result;
};
const getAllMovies = async () => {
    // Lấy tất cả cột, sắp xếp phim mới nhất lên đầu
    const sql = `SELECT * FROM movie1 ORDER BY id DESC`;
    
    const [rows] = await db.execute(sql);
    return rows; // Trả về mảng danh sách phim
};
const deleteMovieById = async (id) => {
    const sql = `DELETE FROM movie1 WHERE id = ?`;
    const [result] = await db.execute(sql, [id]);
    return result;
};
module.exports = {
    createMovie,
    getAllMovies,
    deleteMovieById
};