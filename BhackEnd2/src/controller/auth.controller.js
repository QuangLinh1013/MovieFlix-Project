// src/controller/auth.controller.js
const userService = require('../service/user.service'); 

const postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await userService.handleLogin({ username, password });

        if (result.success) {
            // 1. 👇 THÊM ĐOẠN NÀY: Lưu Token vào Cookie thay vì trả về JSON
            res.cookie('accessToken', result.token, {
                httpOnly: true,  // Quan trọng: Chặn JS đọc
                secure: false,   // Để false nếu chạy localhost. Đổi true khi deploy
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 1 ngày
            });

            return res.status(200).json({
                message: result.message,
                // token: result.token, 👈 XÓA DÒNG NÀY (Không gửi token về client nữa)
                user: result.user
            });
        } else {
            return res.status(401).json({
                message: result.message
            });
        }
    } catch (error) {
        console.error("LỖI SERVER KHI ĐĂNG NHẬP:", error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ.'
        });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params; 

    try {
        await userService.deleteUser(id);
        return res.status(200).json({
            message: 'Đã xóa người dùng thành công!',
            status: 200
        });
    } catch (error) {
        console.error("Lỗi xóa user:", error);
        return res.status(500).json({ message: 'Lỗi server không xóa được.' });
    }
};

module.exports = {
    postLogin,
    deleteUser
};