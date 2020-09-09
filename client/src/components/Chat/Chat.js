import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import Users from "../users/users";
import laptop from "../../icons/laptop.png";

import "./Chat.css";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const END = "localhost:5000";
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    axios.get(`http://localhost:5000/allmsg?room=${room}`)
      .then(res => {
        console.log(res.data.messages)
        const msgs = res.data.messages;
        const new_msgs = [];
        res.data.messages.map(({ user, text }) => new_msgs.push({ user, text }));
        console.log(new_msgs)
        setMessages(new_msgs);
      },
        err => {
          console.log(err)
        })
  }, []);
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(END);
    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, (error) => { console.log(error) });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
      console.log(users);
    });
    console.log(socket);

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [END, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", { message, room, name }, () => setMessage(""));
    }
  };
  console.log(message, messages);
  return (
    <div className="outerContainer">

      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <Users users={users} />
    </div>
  );
};

Chat.propTypes = {};

export default Chat;
