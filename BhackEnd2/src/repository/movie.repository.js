const connection = require('../config/database'); // Kết nối DB của bạn

class MovieRepository {
  async createMovie(movieData) {
    const { title, poster_url, trailer_url, video_url, duration, rating, genre } = movieData;
    const sql = `
      INSERT INTO movies (title, poster_url, trailer_url, video_url, duration, rating, genre)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(sql, [
      title, poster_url, trailer_url, video_url, duration, rating, genre
    ]);
    return result.insertId;
  }
  // Thêm phương thức tìm kiếm phim theo thể loại
  async findByGenre(genreName) {
    // Dấu % đại diện cho bất kỳ chuỗi ký tự nào trước và sau từ khóa
    const sql = `SELECT * FROM movies WHERE genre LIKE ? ORDER BY created_at DESC`;
    const [rows] = await connection.execute(sql, [`%${genreName}%`]);
    return rows;
  }
  async searchAutocomplete(query) {
    // Tìm các phim có tiêu đề chứa từ khóa query
    const sql = `
      SELECT id, title, poster_url
      FROM movies 
      WHERE title LIKE ?
      LIMIT 5
    `;
    const [rows] = await connection.execute(sql, [`%${query}%`]);
    return rows;
  }
  // Thêm phương thức xóa phim theo ID
  async delete(id) {
    const sql = `DELETE FROM movies WHERE id = ?`;
    const [result] = await connection.execute(sql, [id]);
    return result.affectedRows > 0; // Trả về true nếu có 1 dòng bị xóa
  }

  // Hàm phụ: Lấy thông tin phim trước khi xóa (để lấy link Cloudinary nếu cần)
  async findById(id) {
    const [rows] = await connection.execute('SELECT * FROM movies WHERE id = ?', [id]);
    return rows[0];
  }
  async findAll() {
    try {
        // Lấy tất cả phim, sắp xếp theo ID mới nhất
        const [rows] = await connection.query("SELECT * FROM movies ORDER BY id DESC");
        return rows;
    } catch (error) {
        console.error("Lỗi SQL tại MovieRepository:", error);
        throw error;
    }
  
}
}

module.exports = new MovieRepository();