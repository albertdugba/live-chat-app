const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const socket = require("socket.io");
const io = socket(http);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket => {
  socket.emit("message", "Welcome to laron shalley customer support");

  // broadcast a message when a user connects
  socket.broadcast.emit("message", " A user has connected to the live chat");

  // disconnects when a user closes the tab
  socket.on("disconnect", () => {
    io.emit("message", "oops the user is disconnected");
  });

  // listen for events from the client
  socket.on("chatMessage", msg => {
    io.emit("message", msg);
  });
});

const PORT = 5000 || process.env.PORT;

http.listen(PORT, () => console.log("server is listening on port 5000"));
