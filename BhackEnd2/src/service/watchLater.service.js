const watchLaterRepo = require('../repository/watchLater.repository');

const watchLaterService = {
    // Logic Toggle: Kiểm tra tồn tại -> Quyết định Thêm hay Xóa
    toggleItem: async (userId, movieId) => {
        // 1. Kiểm tra xem đã tồn tại chưa
        const existingItem = await watchLaterRepo.findItem(userId, movieId);

        if (existingItem) {
            // 2A. Nếu có rồi -> Gọi Repo xóa
            await watchLaterRepo.removeItem(userId, movieId);
            return { status: 'removed', message: "Đã xóa khỏi danh sách" };
        } else {
            // 2B. Nếu chưa có -> Gọi Repo thêm
            await watchLaterRepo.addItem(userId, movieId);
            return { status: 'added', message: "Đã thêm vào danh sách" };
        }
    },
    // Logic lấy danh sách
    getListByUser: async (userId) => {
        // Có thể thêm logic: kiểm tra user có tồn tại không, hay filter dữ liệu ở đây
        const list = await watchLaterRepo.getList(userId);
        return list;
    },

    // Logic kiểm tra trạng thái
    checkIsSaved: async (userId, movieId) => {
        const item = await watchLaterRepo.findItem(userId, movieId);
        return !!item; // Trả về true nếu có, false nếu không
    }
};

module.exports = watchLaterService;