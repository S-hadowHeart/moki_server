const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  }
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("register", (username) => {
    onlineUsers.set(socket.id, username);
    console.log(`${username} connected. Total online: ${onlineUsers.size}`);
    io.emit("onlineCount", onlineUsers.size);
  });

  socket.on("broadcastMessage", ({ username, message }) => {
    io.emit("receiveMessage", { username, message });
  });

  socket.on("disconnect", () => {
    const username = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    console.log(`${username} disconnected. Total online: ${onlineUsers.size}`);
    io.emit("onlineCount", onlineUsers.size);
  });
});

app.get("/", (req, res) => {
  res.send("TTS Broadcast Server Running!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
