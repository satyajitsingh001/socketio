const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");

//middleware
app.use(express.json());
app.use(cors());
dotenv.config({ path: "config/.env" });

const Server = http.createServer(app);

const io = socketio(Server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    Credential: true,
  },
});
app.set("io", io);

app.get("/", (req, res) => {
  res.send("Hello app");
});

//socket basic
// io.on("connect", (socket) => {
//   console.log("client connected =============>", socket.id);

//   socket.emit("welcome", `welcome to the server ${socket.id}`);
//   socket.broadcast.emit("userjoin", `user join ${socket.id}`);

//   socket.on("disconnect", () => {
//     console.log(`user disconnected ${socket.id}`);
//   });
// });

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-message", message);
  });


  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

Server.listen(process.env.PORT, () => {
  console.log(`🚀 server is running on port ${process.env.PORT}`);
});
