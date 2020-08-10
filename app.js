const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const socket = require("socket.io");
const mysql = require("mysql");
const formatMessage = require("./utils/message");
const io = socket(http);

const { userJoin, getCurrentUser, userLeave } = require("./utils/users");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "live_chat",
});

app.use("/chat_messages", (req, res) => {
  // chat messages
  db.query("SELECT * FROM chat_messages", (error, result, field) => {
    if (error) console.log("Error");
    console.log(result);
    res.end();
  });
  // users
  db.query("SELECT * FROM users", (error, result, field) => {
    if (error) throw error;
    console.log(result);
  });
});

app.use(express.static(path.join(__dirname, "public")));

const botName = "Admin✅";

io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    // insert data into users table
    db.query("INSERT INTO users (username) VALUES (' " + username + " ')");
    socket.join(user.room);

    // welcome message
    socket.emit(
      "message",
      formatMessage(
        botName,
        `${username} you're welcome to laronshalley customer support`
      )
    );

    // broadcast a message when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(
          botName,
          ` ${user.username} has connected to the live chat`
        )
      );

    // get room users
    // io.to(user.room).emit("rootUsers", {
    //   room: user.room,
    //   users: getRoomUsers(room),
    // });
  });

  // listen for events from the client
  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));

    db.query("INSERT INTO chat_messages (messages) VALUES (' " + msg + " ')");
  });

  // disconnects when a user closes the tab
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `oops ${user.username} is disconnected`)
      );
    }

    // // get room users
    // io.to(user.room).emit("rootUsers", {
    //   room: user.room,
    //   users: getRoomUsers(room),
    // });
  });
});

const PORT = 5000 || process.env.PORT;

http.listen(PORT, () => console.log("server is listening on port 5000"));
