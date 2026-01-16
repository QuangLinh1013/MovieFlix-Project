const { Router } = require('express');

// 1. Import các Controller
// (Lưu ý: Bạn nhớ sửa tên file 'contrroller' thừa chữ r nếu đã sửa tên file thật)
const { postCreactUser, getAllUsers,   } = require('../../controller/users.contrroller'); 
const { postLogin, deleteUser } = require('../../controller/auth.controller');
const googleController = require('../../controller/google-auth.controller');
const userController = require('../../controller/users.contrroller');
const authMiddleware = require('../../middleware/auth.middleware');



// 2. Import Middleware
const { requireAdmin, requireAuth } = require('../../middleware/auth.middleware');

const router = Router();

// --- AUTH ROUTER ---
router.post('/create', postCreactUser);
router.post('/login', postLogin);

// 👇 3. THÊM ROUTE LOGOUT (Bắt buộc khi dùng Cookie) 👇
// Bạn có thể viết inline ở đây hoặc chuyển vào auth.controller đều được
router.post('/logout', (req, res) => {
    // Lệnh này sẽ xóa cookie 'accessToken' ở trình duyệt
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false, // Đổi true nếu deploy
        sameSite: 'strict',
        path: '/' // Quan trọng: Đảm bảo xóa đúng đường dẫn
    });
    
    return res.status(200).json({ message: "Đăng xuất thành công" });
});

// --- GOOGLE AUTH ---
// ⚠️ LƯU Ý: Trong googleController.googleLogin bạn CŨNG PHẢI dùng res.cookie nhé!
router.post('/auth/google', googleController.googleLogin);

// --- USER MANAGEMENT (Admin Only) ---
// Route lấy tất cả user (Đã có middleware bảo vệ)
router.get('/all-users', requireAdmin, getAllUsers);

// Route xóa user
router.delete('/delete/:id', requireAdmin, deleteUser);
//them ảnh
router.put('/update-avatar', requireAuth, userController.updateAvatar);
router.get('/me', requireAuth, userController.getCurrentUser);
module.exports = router;