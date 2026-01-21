const notificationRepo = require('../repository/notification.repository');

const createNotification = async (data) => {
    // data bao gồm: { user_id, title, message, type, link }
    
    // BƯỚC 1: Lưu vào Database trước (Để đảm bảo dữ liệu an toàn)
    const newId = await notificationRepo.create(data);

    // Chuẩn bị dữ liệu để bắn Socket (Thêm ID và thời gian thực)
    const notificationData = {
        id: newId,
        ...data,
        is_read: 0,
        created_at: new Date()
    };

    // BƯỚC 2: BẮN REAL-TIME SOCKET
    if (global.io) {
        if (data.user_id) {
            // TRƯỜNG HỢP A: Gửi riêng cho 1 người
            // Emit vào "Room" có tên là user_id (Ví dụ room "15")
           // console.log(`📡 Bắn socket tới user: ${data.user_id}`);
            global.io.to(data.user_id.toString()).emit("getNotification", notificationData);
        } else {
            // TRƯỜNG HỢP B: Gửi cho tất cả (Broadcast)
           // console.log(`📡 Bắn socket tới TOÀN BỘ User`);
            global.io.emit("getNotification", notificationData);
        }
    } else {
        console.warn("⚠️ Socket.io chưa được khởi tạo!");
    }

    return notificationData;
};

    // ... hàm sendNotification cũ ...

    // 👇 THÊM HÀM MỚI NÀY:
    const getUserNotifications = async (userId) => {
        try {
            if (!userId) {
                throw new Error("Thiếu User ID");
            }

            // Gọi xuống Repo lấy dữ liệu
            const notifications = await notificationRepo.getNotificationsByUserId(userId);
            
            return notifications;
        } catch (error) {
            console.error("Lỗi tại NotificationService:", error);
            throw error;
        }
    }

module.exports = { createNotification, getUserNotifications };