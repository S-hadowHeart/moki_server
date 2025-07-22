const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  onlineUsers.add(socket.id);

  io.emit("userCount", onlineUsers.size);

  socket.on("broadcast", ({ username, message }) => {
    io.emit("receive", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    onlineUsers.delete(socket.id);
    io.emit("userCount", onlineUsers.size);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
