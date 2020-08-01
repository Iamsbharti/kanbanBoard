const socketio = require("socket.io");
const mongoose = require("mongoose");
const events = require("events");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//init eventemitter
const eventEmitter = new events.EventEmitter();

exports.setSocketServer = (server) => {
  console.log("Socket server INIT");
  let io = socketio.listen(server);

  let myio = io.of("/multiuser");

  let onlineUsers = [];
  myio.on("connection", (socket) => {
    console.log("Emit On Conenction");
    socket.emit("authenticate", "");

    //authorize user
    socket.on("set-user", (authToken) => {
      console.log("Authenticating user");
      if (authToken) {
        jwt.verify(authToken, process.env.TOKEN_SECRET, (error, decoded) => {
          if (error != null) {
            console.log("Auth-Error");
            socket.emit("Auth-Error", error);
          } else {
            const { userId, firstName, lastName } = decoded.data;
            let name = firstName + " " + lastName;
            socket.userId = userId;
            socket.name = name;
            console.log(`${name} is online`);
            /**for self */
            socket.emit(userId, "You are online");
            /**push onlineuser to array*/
            /*onloneUsers = onlineUsers.map((user) => {
              if (user.userId !== userId) {
                onlineUsers.push({ userId: userId, name: name });
              }
            });*/
            let userIdList = [];
            onlineUsers.map((usr) => userIdList.push(usr.userId));
            console.log("userIdList::", userIdList);
            if (!userIdList.includes(userId)) {
              console.log(`${userId}-not found in list`);
              onlineUsers.push({ userId: userId, name: name });
            }
            console.log(onlineUsers);
            /**set room */
            socket.room = "kanbanboard";
            socket.join(socket.room);
            /**broadcast the online users list */
            console.log("Emit online-users-list");
            socket.to(socket.room).broadcast.emit("online-users", onlineUsers);
            myio.emit("online-users", onlineUsers);
          }
        });
      }
    });
    /**logout/disconnect user listener*/
    socket.on("disconnect", (data) => {
      console.log("User Disconnected", data);
      onlineUsers = onlineUsers.filter((user) => user.userId != data.userId);
      console.log("Updated onlineusers::", onlineUsers);
      /**remove from socket and broadcat the updated list */
      socket.to(socket.room).broadcast.emit("online-users", onlineUsers);
      return onlineUsers;
    });
  });
};
