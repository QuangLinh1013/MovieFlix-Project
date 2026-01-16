const googleService = require('../service/google-auth.service');

const googleLogin = async (req, res) => {
    try {
        const { token, type } = req.body; 
        
        if (!token) {
            return res.status(400).json({ message: "Thiếu Token" });
        }

        const tokenType = type || 'access_token';

        // 1. Lấy kết quả từ Service (Kết quả này chứa cả User Info và Token JWT mới tạo)
        const result = await googleService.login(token, tokenType);

        // 👇 BƯỚC QUAN TRỌNG: Tách Token ra để lưu vào Cookie
        // (Kiểm tra xem bên service bạn return key là 'token' hay 'JWT_SECRET' nhé)
        const accessToken = result.token || result.accessToken;

        // 👇 BƯỚC 2: CẤU HÌNH COOKIE (Copy y hệt hàm Login thường)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false, // Localhost bắt buộc để false
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        });

        // 👇 BƯỚC 3: TRẢ VỀ KẾT QUẢ (Chỉ trả User Info, KHÔNG trả Token trong JSON nữa)
        // Lọc bớt dữ liệu nhạy cảm nếu cần
        const userInfo = result.user || result.data || result; // Tùy vào cấu trúc service trả về

        return res.status(200).json({
            message: "Đăng nhập Google thành công",
            data: {
                id: userInfo.id || userInfo._id,
                username: userInfo.username || userInfo.name,
                role: userInfo.role,
                avatar: userInfo.avatar
                // Không return token ở đây nữa
            }
        });

    } catch (error) {
        console.error("Google Login Error:", error); // Log lỗi ra để dễ debug
        return res.status(401).json({ message: error.message || "Lỗi xác thực Google" });
    }
};

module.exports = { googleLogin };