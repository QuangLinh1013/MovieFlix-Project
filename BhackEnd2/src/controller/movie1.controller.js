const movieService = require('../service/movie1.service');

const addMovie = async (req, res) => {
    try {
        // req.body chứa thông tin chữ (title, m3u8_url...)
        // req.file chứa thông tin file ảnh (do multer xử lý)
        
        console.log("Dữ liệu nhận được:", req.body);
        console.log("File ảnh:", req.file);

        if (!req.body.title || !req.body.m3u8_url) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu tên phim hoặc link M3U8" 
            });
        }

        const result = await movieService.addNewMovie(req.body, req.file);

        return res.status(201).json({
            success: true,
            message: "Thêm phim thành công!",
            movieId: result.insertId
        });

    } catch (error) {
        console.error("Lỗi thêm phim:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi Server" 
        });
    } 
};
const getAllMovies = async (req, res) => {
    try {
        const movies = await movieService.getAllMovies();
        
        // Trả về mảng phim với mã 200 (OK)
        return res.status(200).json(movies);
        
    } catch (error) {
        console.error("Lỗi lấy danh sách phim:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi Server không lấy được danh sách phim" 
        });
    }
};
const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ url ví dụ: /delete/5
        
        if (!id) {
            return res.status(400).json({ message: "Thiếu ID phim!" });
        }

        const result = await movieService.removeMovie(id);

        // Kiểm tra xem có xóa được dòng nào không (affectedRows)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy phim có ID này để xóa." });
        }

        return res.status(200).json({ message: "Đã xóa phim thành công!" });

    } catch (error) {
        console.error("Lỗi xóa phim:", error);
        return res.status(500).json({ message: "Lỗi Server khi xóa phim." });
    }
};
module.exports = {
    addMovie,
    getAllMovies,
    deleteMovie
};