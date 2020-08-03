const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Room = mongoose.model("Room");
//les routers de services

router.get("/allmsg", async (req, res, next) => {
  console.log(req.query.room);
  const room = await Room.findOne({ "name": req.query.room });
  console.log(room);
  if (!room) {
    return res.json({
      'messages': []
    })
  }
  return res.status(200).json({
    'messages': room.messages
  })
});

module.exports = router;
