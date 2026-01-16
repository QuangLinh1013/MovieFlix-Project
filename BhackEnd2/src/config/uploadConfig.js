const multer = require('multer');

// Sử dụng MemoryStorage để lưu vào RAM (trung gian trước khi lên Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Cho phép upload nếu là Ảnh HOẶC Video
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        // Nếu không phải ảnh hoặc video thì báo lỗi
        cb(new Error('Chỉ được phép upload file Ảnh hoặc Video!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        // Tăng giới hạn file lên 100MB (Video thường nặng)
        // Nếu file lớn hơn số này sẽ bị lỗi "File too large"
        fileSize: 100 * 1024 * 1024 
    }
});

module.exports = upload;