const bannerRepo = require('../repository/trailer.repository');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- HÀM HELPER UPLOAD ---
const uploadBuffer = (buffer, folder, resourceType) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { 
                folder: folder,
                resource_type: resourceType // <--- QUAN TRỌNG: Dòng này quyết định Video hay Ảnh
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// 1. Hàm Upload Video
const uploadVideoOnly = async (title, file) => {
    // Tham số thứ 3 là 'video' -> Cloudinary sẽ hiểu đây là file mp4
    const result = await uploadBuffer(file.buffer, 'my_videos', 'video');
    
    return await bannerRepo.createVideo(title, result.secure_url, result.public_id);
};

// 2. Hàm Upload Ảnh
const uploadImageOnly = async (title, file) => {
    // Tham số thứ 3 là 'image' -> Cloudinary sẽ hiểu đây là file jpg/png
    const result = await uploadBuffer(file.buffer, 'my_banners', 'image');
    
    return await bannerRepo.createImage(title, result.secure_url, result.public_id);
};
const deleteVideoService = async (id) => {
    // Bước 1: Tìm xem video có tồn tại không
    const video = await bannerRepo.getVideoById(id);
    if (!video) return false; // Không tìm thấy

    // Bước 2: Xóa trên Cloudinary (Nếu có public_id)
    if (video.video_public_id) {
        try {
            await cloudinary.uploader.destroy(video.video_public_id, { resource_type: 'video' });
        } catch (err) {
            console.error("Lỗi xóa file trên Cloudinary:", err);
            // Vẫn tiếp tục xóa DB dù lỗi Cloudinary (để tránh rác DB)
        }
    }

    // Bước 3: Xóa trong Database
    await bannerRepo.deleteVideoById(id);
    return true;
};

// 4. Xóa Ảnh
const deleteImageService = async (id) => {
    const image = await bannerRepo.getImageById(id);
    if (!image) return false;

    if (image.image_public_id) {
        try {
            // Với ảnh, resource_type mặc định là 'image' nên không cần truyền tham số thứ 2
            await cloudinary.uploader.destroy(image.image_public_id);
        } catch (err) {
            console.error("Lỗi xóa file trên Cloudinary:", err);
        }
    }

    await bannerRepo.deleteImageById(id);
    return true;
};
module.exports = {
    uploadVideoOnly,
    uploadImageOnly,
    getVideos: bannerRepo.getAllVideos,
    getImages: bannerRepo.getAllImages,
    deleteVideoService,
    deleteImageService
};