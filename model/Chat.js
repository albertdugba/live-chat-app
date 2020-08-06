const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  message: {
    type: String,
  },

  sender: {
    type: String,
  },

  createdAt: { type: Date.now },
});

module.exports = mongoose.model("Chat", ChatSchema);
