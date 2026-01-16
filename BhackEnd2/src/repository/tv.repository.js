// src/repositories/tvRepository.js
const connection = require('../config/database');

class TvRepository {
    // 1. Lấy danh sách nhóm kênh (cho Navbar)
    async getAllGroups() {
        const [rows] = await connection.query(
            "SELECT * FROM channel_groups ORDER BY sort_order ASC"
        );
        return rows;
    }

    // 2. Lấy danh sách kênh (kèm tên nhóm để làm filter)
    async getAllChannels() {
        // JOIN bảng channels với groups để lấy cái slug (VTV, HTV...)
        const query = `
            SELECT c.*, g.slug as network, g.name as group_name 
            FROM channels c
            LEFT JOIN channel_groups g ON c.group_id = g.id
            WHERE c.status = 'active'
            ORDER BY c.id ASC
        `;
        const [rows] = await connection.query(query);
        return rows;
    }

    // 3. Lấy chi tiết 1 kênh (nếu cần play riêng)
    async getChannelBySlug(slug) {
        const query = `
            SELECT c.*, g.slug as network 
            FROM channels c
            LEFT JOIN channel_groups g ON c.group_id = g.id
            WHERE c.slug = ? AND c.status = 'active'
        `;
        const [rows] = await connection.query(query, [slug]);
        return rows[0];
    }
    async createChannel(data) {
        const { name, slug, stream_url, logo_url, group_id } = data;
        const query = `
            INSERT INTO channels (name, slug, stream_url, logo_url, group_id, status)
            VALUES (?, ?, ?, ?, ?, 'active')
        `;
        // Kết quả trả về chứa insertId (ID của kênh vừa tạo)
        const [result] = await connection.query(query, [name, slug, stream_url, logo_url, group_id]);
        return result.insertId;
    }

    // 2. Xóa kênh theo ID
    async deleteChannel(id) {
        const query = "DELETE FROM channels WHERE id = ?";
        const [result] = await connection.query(query, [id]);
        return result.affectedRows > 0; // Trả về true nếu xóa thành công
    }
}

module.exports = new TvRepository();