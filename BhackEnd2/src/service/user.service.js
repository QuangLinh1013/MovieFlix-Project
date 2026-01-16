const userRepo = require('../repository/user.repository'); // Chỉ cần import 1 lần thôi
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createNewUser = async ({ username, password, email }) => {
    // 1. MÃ HÓA MẬT KHẨU
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // 2. BẢO MẬT: Gán cứng quyền mặc định
    const safeRole = 'User'; 

    const userData = { 
        username, 
        password: hashedPassword, 
        email, 
        role: safeRole 
    };

    // 3. Gọi Repository
    const results = await userRepo.create(userData); 
    return results;
};

// 👇👇 SỬA HÀM NÀY ĐỂ FIX LỖI MẤT ẢNH 👇👇
const handleLogin = async ({ username, password }) => { // ⚠️ Lưu ý: Nếu bạn đăng nhập bằng Email thì tham số này phải là email
    
    // 1. Tìm user (Đảm bảo Repo trả về đủ cột, bao gồm avatar)
    // Nếu bạn đăng nhập bằng Email thì đổi thành: await userRepo.findByEmail(email/username)
    const user = await userRepo.findByUsername(username);

    if (!user) {
        return { success: false, message: 'Sai tên đăng nhập!' };
    }

    // 2. So sánh mật khẩu
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return { success: false, message: 'Sai mật khẩu!' };
    }
    
    // 3. TẠO TOKEN (SỬA LẠI)
    const token = jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            role: user.role,
            avatar: user.avatar // 👈 THÊM DÒNG NÀY: Để Token chứa ảnh
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }    
    );

    // 4. TRẢ VỀ KẾT QUẢ (SỬA LẠI)
    return { 
        success: true, 
        message: 'Đăng nhập thành công!',
        token: token,
        user: { 
            id: user.id, 
            username: user.username, 
            role: user.role,
            avatar: user.avatar // 👈 THÊM DÒNG NÀY: Để Frontend hiển thị ngay
        } 
    };
};

const getAllUsers = async () => {
    const users = await userRepo.findAll();
    return users;
};

const deleteUser = async (id) => {
    const result = await userRepo.deleteById(id);
    return result;
};

const updateUserAvatar = async (userId, avatarUrl) => {
    if (!avatarUrl) throw new Error("Chưa chọn ảnh!");
    return await userRepo.updateAvatar(userId, avatarUrl);
};

const getUserProfile = async (userId) => {
    const user = await userRepo.findById(userId);
    if (!user) {
        throw new Error("User không tồn tại");
    }
    return user;
};

module.exports = {
    createNewUser,
    handleLogin,
    getAllUsers,
    deleteUser,
    updateUserAvatar,
    getUserProfile
};