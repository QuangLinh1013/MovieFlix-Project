// src/services/tvService.js
const tvRepository = require('../repository/tv.repository');

class TvService {
    async getNavbarData() {
        const groups = await tvRepository.getAllGroups();
        // Có thể map dữ liệu nếu cần, ví dụ chỉ lấy key và label
        return groups.map(g => ({
            key: g.slug,   // VTV
            label: g.name  // Kênh VTV
        }));
    }

    async getChannelList() {
        const channels = await tvRepository.getAllChannels();
        
        // Logic phụ: Xử lý dữ liệu trước khi trả về
        return channels.map(ch => ({
            id: ch.id,
            name: ch.name,
            slug: ch.slug,
            logo: ch.logo_url || '/images/default.png', // Fallback nếu thiếu logo
            network: ch.network || 'Other', // Quan trọng cho bộ lọc Frontend
            url: ch.stream_url, // Link m3u8
            is_drm: ch.is_drm
        }));
    }
    async addChannel(data) {
        // Logic: Tự động tạo slug từ tên kênh để lưu vào DB
        // Ví dụ: "VTV1 HD" -> "vtv1-hd"
        const slug = data.name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '') 
            + '-' + Date.now(); // Thêm time để chắc chắn không trùng

        const newChannelData = { ...data, slug };
        return await tvRepository.createChannel(newChannelData);
    }
    async removeChannel(id) {
        return await tvRepository.deleteChannel(id);
    }
    async getNavbarData() {
        const groups = await tvRepository.getAllGroups();
        return groups.map(g => ({
            id: g.id,      // <--- THÊM DÒNG NÀY (Quan trọng)
            key: g.slug,   
            label: g.name  
        }));
    }
}
module.exports = new TvService();