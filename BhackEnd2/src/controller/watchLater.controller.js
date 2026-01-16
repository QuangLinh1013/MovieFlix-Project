const watchLaterService = require('../service/watchLater.service');

const watchLaterController = {
    // API: Toggle
    toggle: async (req, res) => {
        try {
            const { userId, movieId } = req.body;

            // Validate cơ bản
            if (!userId || !movieId) {
                return res.status(400).json({ success: false, message: "Thiếu userId hoặc movieId" });
            }

            // Gọi Service để xử lý logic
            const result = await watchLaterService.toggleItem(userId, movieId);

            // Trả về kết quả
            return res.status(200).json({
                success: true,
                status: result.status,
                message: result.message
            });

        } catch (error) {
            console.error("Lỗi Toggle:", error);
            return res.status(500).json({ success: false, message: "Lỗi Server" });
        }
    },

    // API: Get List
    getMyList: async (req, res) => {
        try {
            const { userId } = req.params;
            const data = await watchLaterService.getListByUser(userId);
            
            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Lỗi Get List:", error);
            return res.status(500).json({ success: false, message: "Lỗi Server" });
        }
    },

    // API: Check Status
    checkStatus: async (req, res) => {
        try {
            const { userId, movieId } = req.query;
            const isSaved = await watchLaterService.checkIsSaved(userId, movieId);
            
            return res.status(200).json({ success: true, isSaved });
        } catch (error) {
            console.error("Lỗi Check Status:", error);
            return res.status(500).json({ success: false });
        }
    }
};

module.exports = watchLaterController;