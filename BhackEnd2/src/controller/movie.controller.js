const MovieService = require('../service/movie.service');

class MovieController {
  async create(req, res) {
  try {
    // Nếu dùng JSON (Body -> raw), dữ liệu nằm trong req.body
    // Nếu dùng Upload (Body -> form-data), link nằm trong req.files
    
    const movieData = {
      title: req.body.title || null,
      poster_url: req.files?.['poster'] ? req.files['poster'][0].path : (req.body.poster_url || null),
      trailer_url: req.files?.['trailer'] ? req.files['trailer'][0].path : (req.body.trailer_url || null),
      video_url: req.files?.['video'] ? req.files['video'][0].path : (req.body.video_url || null),
      duration: req.body.duration || null,
      rating: req.body.rating || 0, // Mặc định là 0 nếu không có
      genre: req.body.genre || null
    };
    // Kiểm tra xem tiêu đề có bị thiếu không
    if (!movieData.title) {
      return res.status(400).json({ error: "Tiêu đề phim (title) là bắt buộc" });
    }

    const movie = await MovieService.addNewMovie(movieData);
    res.status(201).json({ message: "Thành công", data: movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async getAll(req, res) {
    try {
      // Giả sử MovieService có hàm getAllMovies()
      // Nếu chưa có, bạn cần viết nó trong service: return await Movie.find({});
      const movies = await MovieService.getAllMovies(); 
      
     return  res.status(200).json({
        success: true,
        message: "Lấy danh sách phim thành công",
        data: movies
      });
    } catch (error) {
      res.status(500).json({ success: false,message: "Đã xảy ra lỗi máy chủ khi lấy danh sách phim", error: error.message });
    }
  }
// Thêm phương thức lấy phim theo thể loại
    async filterByGenre(req, res) {
    try {
      // Ví dụ URL: /api/movies/search?type=Tình cảm
      const genreName = req.query.type; 
      
      const movies = await MovieService.getMoviesByGenre(genreName);
      
      res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  //Tìm kiếm nhanh gợi ý 
  async autocomplete(req, res) {
    try {
      const { q } = req.query; // Lấy từ khóa từ ?q=...
      const suggestions = await MovieService.getSuggestions(q);
      res.status(200).json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  // Xóa Phim
  async delete(req, res) {
    try {
      const { id } = req.params; // Lấy ID từ URL /api/movies/:id
      const isDeleted = await MovieService.removeMovie(id);

      if (isDeleted) {
        res.status(200).json({
          success: true,
          message: `Đã xóa phim có ID: ${id}`
        });
      }
    } catch (error) {
       return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}


module.exports = new MovieController();