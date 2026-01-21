const app = require('./src/app'); // Import cấu hình từ app.js
require('dotenv').config();
const http = require('http');            // 1. Thêm cái này
const { Server } = require("socket.io"); // 2. Thêm cái này

const port = process.env.PORT || 8888;
const host = process.env.HOST_NAME || 'localhost';

// 3. Tạo HTTP Server bọc lấy Express App
const httpServer = http.createServer(app);

// 4. Cấu hình Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // ⚠️ Link Frontend React của bạn
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 5. QUAN TRỌNG NHẤT: Gán io vào biến toàn cục
global.io = io;

// Debug: Log xem có kết nối không
io.on("connection", (socket) => {
  //console.log("✅ Socket connected:", socket.id);
  
  // Lắng nghe client join vào room theo userId
  socket.on("joinRoom", (userId) => {
    socket.join(userId.toString());
   // console.log(`👤 User ${userId} joined room: ${userId}`);
  });
  socket.on("join_watch_party", (roomId) => {
    socket.join(roomId);
    console.log(`🎬 Socket ${socket.id} đã vào phòng xem chung: ${roomId}`);
    
    // (Tuỳ chọn) Gửi thông báo cho người khác trong phòng là có người mới vào
    socket.to(roomId).emit("user_joined", "Có người mới tham gia!");
  });

  // 2. Đồng bộ thao tác (Play/Pause/Seek)
  socket.on("send_action", (data) => {
    // data bao gồm: { roomId, action: 'play'/'pause'/'seek', time: 10.5 }
    
    // Gửi lại cho TẤT CẢ người khác trong cùng phòng (trừ người gửi)
    socket.to(data.roomId).emit("receive_action", data);
    
    console.log(`Dồng bộ: ${data.action} tại giây ${data.time} ở phòng ${data.roomId}`);
  });
  // Ngắt kết nối
  socket.on("disconnect", () => {
  //  console.log("❌ Socket disconnected:", socket.id);
  });
});

// 6. CHẠY SERVER (Sửa app.listen thành httpServer.listen)
httpServer.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
  //console.log(`Socket.io is ready! 📡`);
});