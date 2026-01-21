const notificationService = require('../service/notification.sevice');

const sendNotification = async (req, res) => {
    try {
        // Admin gửi lên: { userId (có thể null), title, message, type, link }
        const { user_id, title, message, type, link } = req.body;

        // Validate cơ bản
        if (!title || !message) {
            return res.status(400).json({ message: "Thiếu tiêu đề hoặc nội dung!" });
        }

        // Gọi Service xử lý
        const result = await notificationService.createNotification({
            user_id: user_id || null, // Đảm bảo nếu không gửi thì là null
            title,
            message,
            type: type || 'system',
            link: link || null
        });

        return res.status(200).json({
            message: "Gửi thông báo thành công!",
            data: result
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server khi gửi thông báo" });
    }
};

    // ... hàm sendNotification cũ ...

    // 👇 THÊM HÀM MỚI NÀY:
     const getUserNotifications = async (req, res) => {
        try {
            // Lấy User ID từ req.user (Do Middleware xác thực gắn vào)
            // Nếu bạn chưa có middleware auth, tạm thời lấy từ req.query.userId để test
            const userId = req.user?.id || req.query.userId;

            if (!userId) {
                return res.status(401).json({ 
                    message: "Bạn chưa đăng nhập hoặc Token không hợp lệ." 
                });
            }

            const data = await notificationService.getUserNotifications(userId);

            return res.status(200).json({
                message: "Lấy danh sách thông báo thành công",
                data: data
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Lỗi Server khi lấy thông báo." 
            });
        }
    }
module.exports = { sendNotification, getUserNotifications };