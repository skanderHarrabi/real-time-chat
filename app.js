require("./config/config");
require("./models/db");
require("./config/passportConfig");
const mongoose = require("mongoose");
const Room = mongoose.model("Room");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");

const rtsIndex = require("./routes/index.router");
const { add } = require("lodash");
const { text } = require("body-parser");

var app = express();

app.use(cors());

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", async (socket) => {
  socket.on("join", async ({ name, room }, cb) => {
    const { error, user, currRoom } = await addUser({ id: socket.id, name, room });
    if (error) {
      socket.emit("message", {
        user: "admin",
        text: `${currRoom.name}, welcome back ${user.name}`,
      });
      socket.join(currRoom.name);
      io.to(currRoom.name).emit("roomData", {
        room: currRoom.name,
        users: await getUsersInRoom(currRoom.name),
      });
      return;
    }

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to our room ${currRoom.name}`,
    });
    socket.broadcast
      .to(currRoom.name)
      .emit("message", { user: "admin", text: `${user.name}, has joined!` });

    socket.join(currRoom.name);
    console.log(currRoom);
    io.to(currRoom.name).emit("roomData", {
      room: currRoom.name,
      users: await getUsersInRoom(currRoom.name),
    });
    cb();
  });
  socket.on("sendMessage", async ({ message, room, name }, cb) => {
    console.log(socket.id);
    const currRoom = await getUser(room);
    io.to(currRoom.name).emit("message", { user: name, text: message });
    const find_room = await Room.findOne({ 'name': currRoom.name });
    const new_msg = {
      user: name,
      text: message
    }
    find_room.messages.push(new_msg);
    find_room.save();
    io.to(currRoom.name).emit("roomData", {
      room: currRoom.name,
      users: await getUsersInRoom(currRoom.name),
    });

    cb();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name},has left.`,
      });
    }
  });
});

app.use("/", rtsIndex);

// app.use(express.static('client/build'));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
// })

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server started at port : ${process.env.PORT}`)
);

// // middleware
// app.use(bodyParser.json());
// app.use('/images',express.static(path.join("./images")));
// app.use(cors());
// app.use((req,res,next)=>{
//  res.setHeader("Access-Control-Allow-Origin", "*");
//  res.setHeader(
//    "Access-Control-Allow-Headers",
//    "Origin, x-Requested-With; Content-Type, Accept, Authorization"
//  );
//  res.setHeader(
//   "Access-Control-Allow-Headers",
//   "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//  );
//  next();
// });
// app.use(passport.initialize());
// app.use('/api', rtsIndex);

// // error handler
// app.use((err, req, res, next) => {
//   if (err.name === 'ValidationError') {
//       var valErrors = [];
//       Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
//       res.status(422).send(valErrors)
//   }
// });

// //start server
// app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));
