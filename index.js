const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
// socket
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

// socket Router
const NotificationRouter = require("./controller/notification")(io);
app.use(bodyParser.json())
app.use("/api/v1", NotificationRouter);

// app.set("view engine", "ejs");

app.set(express.urlencoded({
    extended: false
}));

app.set(express.json());

// app.use(express.static(__dirname + '/node_modules'));
// landing
app.get("/", (req, res) => {
    res.json({
      message: "data delivered",
    });
});

// socket connection
io.on("connection", (socket) => {
    let user = socket.user
    socket.join(user.UID)
    socket.on('disconnect', async (user) => {
        socket.leave(user.UID);
    })
    
});
io.use((socket, next) => {
    const user = socket.handshake.auth.user;
    if (!user) {
        return next(new Error('Invalid Username'));
    }
    socket.user = user
    next();
})

server.listen(PORT, () => {
    console.log("server is running");
});