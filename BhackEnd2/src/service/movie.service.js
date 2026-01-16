const MovieRepository = require('../repository/movie.repository');
const cloudinary = require('cloudinary').v2; 

// Cấu hình lại để Service có quyền truy cập Cloudinary của bạn
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
 
class MovieService {
  async addNewMovie(data) {
    // Bạn có thể thêm logic kiểm tra ở đây
    if (!data.title) throw new Error("Tiêu đề phim không được để trống");
    
    const movieId = await MovieRepository.createMovie(data);
    return { id: movieId, ...data };
  }
  // Thêm phương thức lấy phim theo thể loại
  async getMoviesByGenre(genreName) {
    if (!genreName) throw new Error("Tên thể loại là bắt buộc");
    return await MovieRepository.findByGenre(genreName);
  }
  // Thêm phương thức tìm kiếm nhanh gợi ý
  async getSuggestions(query) {
    if (!query || query.length < 2) return []; // Chỉ tìm khi gõ từ 2 ký tự trở lên
    return await MovieRepository.searchAutocomplete(query);
  }
  //Xóa Phim
  async removeMovie(id) {
    const movie = await MovieRepository.findById(id);
    if (!movie) throw new Error("Không tìm thấy phim để xóa");

    if (movie.poster_url) {
        try {
            // 1. Tách Public ID một cách an toàn
            const parts = movie.poster_url.split('/');
            const fileNameWithExtension = parts.pop(); // Ví dụ: "abcxyz.jpg"
            const publicIdOnly = fileNameWithExtension.split('.')[0]; // Ví dụ: "abcxyz"
            
            // 2. Nếu bạn có dùng folder (ví dụ 'movies_assets'), hãy nối thêm vào
            // Nếu không dùng folder thì chỉ cần: const finalPublicId = publicIdOnly;
            const finalPublicId = `movies_assets/${publicIdOnly}`;

            console.log("Đang xóa Public ID:", finalPublicId);

            // 3. Chỉ gọi destroy nếu finalPublicId có giá trị
            if (publicIdOnly) {
                await cloudinary.uploader.destroy(finalPublicId);
            }
        } catch (err) {
            console.error("Lỗi khi xóa ảnh trên Cloudinary:", err.message);
            // Không throw error ở đây để vẫn tiếp tục xóa được trong DB
        }
    }

    // Cuối cùng mới xóa trong Database
    return await MovieRepository.delete(id);
}
async getAllMovies () {
    // Bạn có thể thêm logic xử lý dữ liệu ở đây nếu cần
    return await MovieRepository.findAll();
}
}
module.exports = new MovieService();