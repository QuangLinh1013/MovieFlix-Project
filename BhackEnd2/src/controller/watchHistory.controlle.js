const historyService = require('../service/watchHistory.service');
const historyRepository = require('../repository/watchHistory.repository');

const addToHistory = async (req, res) => {
    try {
        const { userId, movieId } = req.body; // Hoặc lấy userId từ req.user nếu có JWT
        await historyService.addMovieToHistory(userId, movieId);
        res.status(200).json({ success: true, message: "Đã lưu vào lịch sử" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const history = await historyService.getUserWatchHistory(userId);
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteHistoryItem = async (req, res) => {
    try {
        // 1. Lấy dữ liệu từ Request
        const { userId, movieId } = req.body; 

        // 2. Validate (Kiểm tra dữ liệu)
        if (!userId || !movieId) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu userId hoặc movieId" 
            });
        }

        // 3. Gọi Repository để xóa
        const result = await historyRepository.deleteHistory(userId, movieId);

        // 4. Kiểm tra kết quả
        // affectedRows là số dòng bị tác động. Nếu = 0 nghĩa là không tìm thấy để xóa.
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy lịch sử để xóa (hoặc đã xóa rồi)" 
            });
        }

        // 5. Trả về thành công
        return res.status(200).json({ 
            success: true, 
            message: "Đã xóa thành công" 
        });

    } catch (error) {
        console.error("❌ Lỗi Controller xóa lịch sử:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi Server" 
        });
    }
};

module.exports = { addToHistory, getHistory, deleteHistoryItem };