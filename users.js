const { indexOf } = require("lodash");
const mongoose = require("mongoose");
const Room = mongoose.model("Room");

const users = [];
const addUser = async ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  const user = { id, name, room };
  const existingRoom = await Room.findOne({ 'name': room });
  // if (existingRoom) {
  //   return { error: "user exist" };
  // }
  if (existingRoom) {
    const index = existingRoom.user.findIndex((user) => user.name === name)
    if (index == -1) {
      existingRoom.user.push({ name });
      await existingRoom.save();
      return { user: { name: name }, currRoom: existingRoom };
    } else {
      const currUser = existingRoom.user[index]
      return { error: "user exist", user: currUser, currRoom: existingRoom };
    }
  } else {
    const roomToAdd = new Room();
    roomToAdd.name = room;
    roomToAdd.user = []
    roomToAdd.user.push({ name });
    console.log("wxcwxc", roomToAdd.user, name)
    roomToAdd.messages = []
    console.log("dfdf", roomToAdd)
    await roomToAdd.save();
    users.push(user);
    return { user: { name: name }, currRoom: roomToAdd };
  }

};
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};
const getUser = async (room) => {
  const currRoom = await Room.findOne({ 'name': room });
  return currRoom;
};

const getUsersInRoom = async (room) => {
  const currRoom = await Room.findOne({ 'name': room });
  console.log(currRoom.user)
  return currRoom.user;
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
