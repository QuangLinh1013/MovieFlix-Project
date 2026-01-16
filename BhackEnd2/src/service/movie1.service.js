const movieRepository = require('../repository/movie1.repository');
const cloudinary = require('cloudinary').v2;
// BỎ: const fs = require('fs'); -> Không cần dùng nữa

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const addNewMovie = async (body, file) => {
    let posterPath = null;
    let originalName = null;
    let posterPublicId = null;

    if (file) {
        try {
            // --- XỬ LÝ UPLOAD TỪ RAM (BUFFER) ---
            
            // 1. Chuyển Buffer thành chuỗi Base64
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = "data:" + file.mimetype + ";base64," + b64;

            // 2. Upload chuỗi Data URI lên Cloudinary
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'movies_assets',
                resource_type: 'auto', // Tự động nhận diện loại file
                // use_filename: true -> Không dùng được khi upload kiểu này, Cloudinary sẽ random tên
            });

            posterPath = result.secure_url; 
            originalName = file.originalname;
            posterPublicId = result.public_id;

            // KHÔNG CẦN XÓA FILE (fs.unlink) VÌ CÓ TẠO FILE ĐÂU MÀ XÓA!

        } catch (error) {
            console.error("Lỗi upload ảnh lên Cloudinary:", error);
        } 
    }

    const movieData = {
        title: body.title || null,     
        m3u8_url: body.m3u8_url || null,
        poster_path: posterPath,
        poster_original_name: originalName,
        poster_public_id: posterPublicId, // Nếu DB có cột này
        genre: body.genre || null,
        duration: body.duration || null,
        description: body.description || '',
        rating: body.rating || 0.0,
        is_vip: (body.is_vip === 'true' || body.is_vip === '1' || body.is_vip === 1) ? 1 : 0
    };

    return await movieRepository.createMovie(movieData);
};

const getAllMovies = async () => {
    return await movieRepository.getAllMovies();
};

const removeMovie = async (id) => {
    // Logic xóa giữ nguyên
    return await movieRepository.deleteMovieById(id);
};

module.exports = {
    addNewMovie,
    getAllMovies,
    removeMovie
};