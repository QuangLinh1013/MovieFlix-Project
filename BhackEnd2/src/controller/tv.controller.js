// src/controllers/tvController.js
const tvService = require('../service/tv.service');

class TvController {
    // API: GET /api/nav
    async getNav(req, res) {
        try {
            const data = await tvService.getNavbarData();
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server khi lấy menu' });
        }
    }

    // API: GET /api/channels
    async getChannels(req, res) {
        try {
            const data = await tvService.getChannelList();
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server khi lấy danh sách kênh' });
        }
    }
    async create(req, res) {
        try {
            // req.body chứa: name, stream_url, group_id...
            const newId = await tvService.addChannel(req.body);
            res.status(201).json({ message: 'Thêm thành công', id: newId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi khi thêm kênh' });
        }
    }

    // API: DELETE /api/channels/:id
    async delete(req, res) {
        try {
            const { id } = req.params;
            const success = await tvService.removeChannel(id);
            if (success) {
                res.status(200).json({ message: 'Đã xóa kênh' });
            } else {
                res.status(404).json({ message: 'Không tìm thấy kênh' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi khi xóa kênh' });
        }
    }
}

module.exports = new TvController();