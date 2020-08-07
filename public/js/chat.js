const chatForm = document.querySelector(".chat__form");
const chatMessages = document.querySelector(".chat__messages");
const rooName = document.getElementById("room__name");
const userList = document.getElementById("room");
// const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "users",
// });

const socket = io();

// get username and room from the url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// select room
socket.emit("joinRoom", { username, room });

// socket.on("roomUsers", ({ room, users }) => {
//   outputRoomName(room);
//   outputRoomUsers(users);
// });

socket.on("message", msg => {
  outputMessage(msg);

  // scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", event => {
  event.preventDefault();

  const msg = event.target.elements.msg.value;

  // send data to the server
  socket.emit("chatMessage", msg);

  // clear form field
  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
  // insert();
});

const outputMessage = message => {
  const div = document.createElement("div");

  div.classList.add("message");
  div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
   ${message.text}
  </p>`;

  document.querySelector(".chat__messages").appendChild(div);
};
