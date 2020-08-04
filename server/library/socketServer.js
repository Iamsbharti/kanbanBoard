const socketio = require("socket.io");
const mongoose = require("mongoose");
const events = require("events");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const { stat } = require("fs");

//init eventemitter
const eventEmitter = new events.EventEmitter();

exports.setSocketServer = (server) => {
  console.log("Socket server INIT");
  let io = socketio.listen(server);

  /**cors fix */
  io.origins("*:*");
  let myio = io.of("/multiusers");

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
            console.log("________________DECODED__________");
            const { userId, firstName, lastName } = decoded.data;
            let name = firstName + " " + lastName;
            socket.userId = userId;
            socket.name = name;
            console.log(`${name} is online`);

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
            //socket.to(socket.room).broadcast.emit("online-users", onlineUsers);
            myio.emit("online-users", onlineUsers);
            //return onlineUsers;
          }
        });
      }
    });
    /**broad case online users */
    myio.emit("online-users", onlineUsers);
    /**listen for friend request */
    socket.on("sentFriendRequest", (friendRequest) => {
      console.log("Recieved Friend Request::", friendRequest);
      const { recieverId, recieverName, senderId, senderName } = friendRequest;

      /**save friend request kepp it separate from socket flow*/
      setTimeout(() => eventEmitter.emit("save-request", friendRequest), 1200);

      /**broadcast the friend request reciever  */
      myio.emit(recieverId, friendRequest);
    });
    /**listen on friend request updates (approval/rejection) */
    socket.on("update-friend-request", (friendRequest) => {
      console.log("Recieved Friend Request Update::", friendRequest);
      /**update friend request */
      setTimeout(
        () => eventEmitter.emit("update-fr-request", friendRequest),
        1200
      );
    });
    /**listen to friend-updated-tasks and emit for concerner friends*/
    socket.on("friend-updated-tasks", (updates, friendsList) => {
      console.log(
        "______________friendlyupdates_________________",
        updates,
        friendsList
      );
      myio.emit("updates-from-friend", updates, friendsList);
    });

    /**logout/disconnect user listener*/
    socket.on("disconnected", (userId) => {
      console.log("User Disconnected", userId);
      onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
      console.log("Updated onlineusers::", onlineUsers);
      /**remove from socket and broadcat the updated list */
      myio.emit("online-users", onlineUsers);
      return onlineUsers;
    });
  });
  /**save-request listener */
  eventEmitter.on("save-request", (friendRequest) => {
    console.log("SAVING FR.......");
    const { recieverId, recieverName, senderId, senderName } = friendRequest;
    let newFriendRequest = {
      uniqueCombination: `${senderId}:${recieverId}`,
      recieverId: recieverId,
      recieverName: recieverName,
      senderId: senderId,
      senderName: senderName,
    };
    FriendRequest.create(newFriendRequest, (error, created) => {
      if (error !== null) {
        console.warn("Error::", error.message);
      } else {
        console.log("FR created::", created.uniqueCombination);
        myio.emit("friendlist-updates");
      }
    });
  });
  /**update-fr-request listener */
  eventEmitter.on("update-fr-request", (friendRequest) => {
    console.log("UPDATING FR_____");
    const {
      recieverId,
      recieverName,
      senderId,
      senderName,
      status,
      uniqueCombination,
    } = friendRequest;
    /**update FriendRequest with status approved,rejected
     * (based on action prop)
     */
    let updateQuery = { uniqueCombination: uniqueCombination };

    FriendRequest.updateOne(updateQuery, friendRequest, (error, updatedFR) => {
      if (error !== null) {
        console.error("Error Updating FR::", error.message);
      } else {
        let { n } = updatedFR;
        console.log("Updated FR::", n + "doc updated");
        updateUsersFriendList(status);
        /**broadcast requestupdate to client */
        console.log("Emit friend request updates");
        myio.emit("friend-request-updates", friendRequest);
      }
    });

    /**update the friend list in User(reciever & sender) if request is approved*/
    const updateUsersFriendList = (status) => {
      if (status === "accepted") {
        let updateQuery = {
          $or: [
            {
              $and: [{ userId: senderId }],
            },
            {
              $and: [{ userId: recieverId }],
            },
          ],
        };

        let friendListUpdate = { friends: [senderId, recieverId] };
        console.log("Updating User's friend List status----", status);
        User.updateMany(updateQuery, friendListUpdate, (error, updated) => {
          if (error !== null) {
            console.error("Error Updating FriendLIst::", error.message);
          } else {
            console.log("Updated USERs FriendList", updated.n);
          }
        });
      }
    };
  });
};
