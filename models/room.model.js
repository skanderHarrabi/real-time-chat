const mongoose = require("mongoose");

var RoomSchema = new mongoose.Schema({
  user: [{
    name: {
      type: String,
      required: true,
    }
  }],
  name: {
    type: String,
    required: "name is required",
  },
  messages: [{
    user: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: "text is required",
    },
  }]
});

mongoose.model("Room", RoomSchema);
