// src/controller/users.contrroller.js (Phiên bản trả về JSON)

const userService = require('../service/user.service'); // Giả sử đã tái cấu trúc
const jwt = require('jsonwebtoken');

const postCreactUser = async (req, res) => {
    const { username, password, email, role } = req.body;

    try {
        // Gọi Service
        const results = await userService.createNewUser({ username, password, email, role });
        
        console.log("Kết quả tạo User thành công:", results);

        // TRẢ VỀ JSON KHI THÀNH CÔNG (Mã 201 Created)
        return res.status(201).json({
            message: 'User created successfully',
            status: 201,
            data: {
                userId: results.insertId,
                // Bạn có thể trả về các thông tin khác nếu cần
            }
        }); 

    } catch (error) {
        console.error("LỖI KHI TẠO USER:", error);      
        
        // Xử lý lỗi trùng lặp (nếu Repository ném lỗi có mã 'ER_DUP_ENTRY')
        if (error.code === 'ER_DUP_ENTRY') {
            // TRẢ VỀ JSON KHI LỖI 409
            return res.status(409).json({
                message: 'Tên đăng nhập hoặc Email đã tồn tại. Vui lòng chọn tên khác.',
                status: 409
            });
        }

        // TRẢ VỀ JSON KHI LỖI 500
        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ.',
            status: 500,
            details: error.message // Có thể thêm chi tiết lỗi (chỉ nên làm trong môi trường DEV)
            
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        
        return res.status(200).json({
            message: "Lấy danh sách thành công",
            users: users // Dữ liệu thật từ DB
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const updateAvatar = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { avatar } = req.body;

        // 1. Cập nhật DB
        await userService.updateUserAvatar(userId, avatar);

        // 2. TẠO TOKEN MỚI (Chứa avatar mới)
        // Lấy lại toàn bộ thông tin user để đóng gói token mới
        const userRefresh = await userService.getUserProfile(userId); 
        
        const newToken = jwt.sign(
            { 
                id: userRefresh.id, 
                role: userRefresh.role, 
                avatar: userRefresh.avatar, // Avatar MỚI
                email: userRefresh.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 3. Gửi Cookie mới đè lên Cookie cũ
        res.cookie('accessToken', newToken, {
            httpOnly: true,
            secure: false, // Để true nếu chạy https
            sameSite: 'strict'
        });

        return res.status(200).json({ message: "Cập nhật thành công!" });

    } catch (err) {
        return res.status(500).json({ message: "Lỗi server" });
    }
}
const getCurrentUser = async (req, res) => {
    try {
        // req.user được tạo ra từ middleware auth, chứa id lấy từ token
        const userId = req.user.id; 

        // QUAN TRỌNG: Gọi service để lấy dữ liệu TƯƠI từ Database
        // Đừng return req.user (vì req.user là dữ liệu cũ trong token)
        const userFromDb = await userService.getUserProfile(userId);

        return res.status(200).json(userFromDb);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
};
// ... các import giữ nguyên



// ... nhớ export hàm login
module.exports = {
    postCreactUser,
    getAllUsers,
    updateAvatar,
    getCurrentUser,
};