const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const socket = require("socket.io");
const mysql = require("mysql");
const formatMessage = require("./utils/message");
const io = socket(http);

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "users",
});

//

// app.get("/", (req, res) => {
//   res.send({ OK: 200 });
// });

app.use(express.static(path.join(__dirname, "public")));

const botName = "Admin✅";

io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    db.query("INSERT INTO `user` (`username`) VALUES (' " + username + " ')");

    socket.join(user.room);

    socket.emit(
      "message",
      formatMessage(botName, "Welcome to laronshalley customer support")
    );

    // const inserData = "INSERT INTO `chat`( `message`) VALUES ('" +room "')";
    // db.query(inserData, (error, result) => {
    //   if (error) console.log(error);
    //   console.log(result);
    // });

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
    io.to(user.room).emit("rootUsers", {
      room: user.room,
      users: getRoomUsers(room),
    });
  });

  // listen for events from the client
  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));

    db.query("INSERT INTO `chat` (`message`) VALUES (' " + msg + " ')");
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
