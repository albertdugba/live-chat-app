const chatForm = document.querySelector(".chat__form");
const chatMessages = document.querySelector(".chat__messages");

const socket = io();

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
});

const outputMessage = message => {
  const div = document.createElement("div");

  div.classList.add("message");
  div.innerHTML = ` <p class="meta">Albert <span>9:12pm</span></p>
  <p class="text">
   ${message}
  </p>`;

  document.querySelector(".chat__messages").appendChild(div);
};
