const db = require('../config/database');

// --- QUẢN LÝ VIDEO ---
const createVideo = async (title, url, publicId) => {
    const sql = `INSERT INTO list_videos (title, video_url, video_public_id) VALUES (?, ?, ?)`;
    const [result] = await db.execute(sql, [title, url, publicId]);
    return result;
};

const getAllVideos = async () => {
    const [rows] = await db.execute("SELECT * FROM list_videos ORDER BY id DESC");
    return rows;
};

// --- QUẢN LÝ ẢNH (BANNER) ---
const createImage = async (title, url, publicId) => {
    const sql = `INSERT INTO list_images (title, image_url, image_public_id) VALUES (?, ?, ?)`;
    const [result] = await db.execute(sql, [title, url, publicId]);
    return result;
};

const getAllImages = async () => {
    const [rows] = await db.execute("SELECT * FROM list_images ORDER BY id DESC");
    return rows;
};
const getVideoById = async (id) => {
    const sql = `SELECT * FROM list_videos WHERE id = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null;
};

const deleteVideoById = async (id) => {
    const sql = `DELETE FROM list_videos WHERE id = ?`;
    const [result] = await db.execute(sql, [id]);
    return result;
};

// --- BỔ SUNG CHO ẢNH ---
const getImageById = async (id) => {
    const sql = `SELECT * FROM list_images WHERE id = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null;
};

const deleteImageById = async (id) => {
    const sql = `DELETE FROM list_images WHERE id = ?`;
    const [result] = await db.execute(sql, [id]);
    return result;
};
module.exports = {
    createVideo, getAllVideos,
    createImage, getAllImages, 
    getVideoById, deleteVideoById,
    getImageById, deleteImageById
};