const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Cấu hình tài khoản
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cấu hình lưu trữ (Storage)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = 'movies_assets'; // Tên thư mục trên Cloudinary
    let resourceType = 'image';       // Mặc định là ảnh

    // Nếu file là video/mp4 thì đổi resource_type
    if (file.mimetype.includes('video')) {
      resource_type = 'video';
    }

    return {
      folder: folderName,
      resource_type: 'auto', // Tự động nhận diện ảnh/video
      allowed_formats: ['jpg', 'png', 'mp4', 'jpeg'],
    };
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;