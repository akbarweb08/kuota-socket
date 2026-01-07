const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const bodyParser = require("body-parser");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  transports: ["websocket"],
  allowUpgrades: false,
});

// Middleware parsing
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Socket middleware auth
io.use((socket, next) => {
  const user = socket.handshake.auth.user;
  if (!user) {
    return next(new Error("Invalid Username"));
  }
  socket.user = user;
  next();
});

// Socket connection
io.on("connection", (socket) => {
  const user = socket.user;
  console.log(`${user.UID} connected`);

  socket.join(user.UID);

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected: ${user.UID}, reason: ${reason}`);
    socket.leave(user.UID);
  });
});

// Router untuk notifikasi
const NotificationRouter = require("./controller/notification")(io);
app.use("/api/v1", NotificationRouter);

// Endpoint test/landing
app.get("/", (req, res) => {
  res.json({
    message: "data delivered",
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
