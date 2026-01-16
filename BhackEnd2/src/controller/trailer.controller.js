const bannerService = require('../service/trailer.service');

// --- API VIDEO ---
const addVideo = async (req, res) => {
    try {
        // req.file (số ít) vì dùng upload.single
        if (!req.file) return res.status(400).json({ message: "Chưa chọn Video!" });

        await bannerService.uploadVideoOnly(req.body.title, req.file);
        
        res.status(200).json({ success: true, message: "Upload Video thành công!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi upload Video" });
    }
};

// --- API ẢNH ---
const addImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Chưa chọn Ảnh!" });

        await bannerService.uploadImageOnly(req.body.title, req.file);

        res.status(200).json({ success: true, message: "Upload Ảnh thành công!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi upload Ảnh" });
    }
};
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await bannerService.deleteVideoService(id);

        if (!success) {
            return res.status(404).json({ message: "Không tìm thấy Video để xóa!" });
        }

        return res.status(200).json({ success: true, message: "Đã xóa Video thành công!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi Server khi xóa Video" });
    }
};

// --- DELETE IMAGE ---
const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await bannerService.deleteImageService(id);

        if (!success) {
            return res.status(404).json({ message: "Không tìm thấy Ảnh để xóa!" });
        }

        return res.status(200).json({ success: true, message: "Đã xóa Ảnh thành công!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi Server khi xóa Ảnh" });
    }
};
// --- GET LIST ---
const getVideos = async (req, res) => res.json(await bannerService.getVideos());
const getImages = async (req, res) => res.json(await bannerService.getImages());

module.exports = { addVideo, addImage, getVideos, getImages, deleteVideo, deleteImage };