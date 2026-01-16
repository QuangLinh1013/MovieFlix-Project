// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const requireAdmin = (req, res, next) => {
    // 👇 THÊM 2 DÒNG LOG NÀY ĐỂ BẮT LỖI
    console.log("1. Đang kiểm tra Cookie...");
    console.log("2. Danh sách Cookies nhận được:", req.cookies); 

    const token = req.cookies.accessToken; 
    
    if (!token) {
        console.log("❌ LỖI: Không tìm thấy token trong cookie!"); // Log lỗi
        return res.status(401).json({ message: 'Bạn chưa đăng nhập!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DAY_LA_MAT_KHAU_BI_MAT'); // Đảm bảo Secret Key đúng
        req.user = decoded; 

        if (req.user.role === 'Admin') {
            console.log("✅ Đã xác thực Admin thành công!");
            next(); 
        } else {
            console.log("⛔ LỖI: User không phải Admin. Role là:", req.user.role);
            return res.status(403).json({ message: 'Không đủ quyền!' });
        }

    } catch (error) {
        console.log("💀 LỖI: Token sai hoặc hết hạn:", error.message);
        return res.status(403).json({ message: 'Token lỗi!' });
    }
};
const requireAuth = (req, res, next) => {
    // 1. Lấy token từ cookie
    const token = req.cookies.accessToken; 
    
    if (!token) {
        return res.status(401).json({ message: 'Bạn chưa đăng nhập!' });
    }

    try {
        // 2. Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DAY_LA_MAT_KHAU_BI_MAT');
        
        // 3. Gán thông tin user vào req để Controller dùng
        req.user = decoded; 
        
        // 4. QUAN TRỌNG: Cho qua luôn, không kiểm tra Role admin
        next(); 

    } catch (error) {
        return res.status(403).json({ message: 'Token lỗi hoặc hết hạn!' });
    }
};
module.exports = { requireAdmin, requireAuth };