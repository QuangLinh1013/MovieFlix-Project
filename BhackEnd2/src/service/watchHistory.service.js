const historyRepo = require('../repository/watchHistory.repository');

const addMovieToHistory = async (userId, movieId) => {
    return await historyRepo.saveHistory(userId, movieId);
};

const getUserWatchHistory = async (userId) => {
    return await historyRepo.getHistoryByUser(userId);
};

const deleteHistoryItem = async (userId, movieId) => {
    try {
        // Dùng method DELETE, truyền data trong property 'data'
        const response = await axios.delete(`${API_DOMAIN}/history/delete`, {
            data: { userId, movieId }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi xóa lịch sử:", error);
        return { success: false };
    }
};

module.exports = { addMovieToHistory, getUserWatchHistory, deleteHistoryItem };