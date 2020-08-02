const FriendRequest = require("../models/FriendRequest");
const { formatResponse } = require("../library/formatResponse");
const { send } = require("process");
const { update } = require("../models/FriendRequest");
const { consoleTestResultHandler } = require("tslint/lib/test");
exports.getFriendList = async (req, res) => {
  console.log("Get friend list control");
  const EXCLUDE = "-__v -_id";
  const { senderId } = req.body;
  /**get friend request information */
  const query = { senderId: senderId };
  /*FriendRequest.find(query)
    .select(EXCLUDE)
    .lean()
    .exec((error, friendRequests) => {
      console.log("error/FR::", error);
      if (error !== null) {
        res
          .status(500)
          .json(
            formatResponse(true, 500, "Error Fetching Friend Requests", error)
          );
      } else {
        res
          .status(200)
          .json(
            formatResponse(false, 200, "FriendRequests Fetched", friendRequests)
          );
      }
    });*/
  let result = await FriendRequest.find({ senderId: senderId });
  res.send(result);
};
/**save friend request */
exports.saveFriendRequest = async (friendRequest) => {
  console.log("save friend request");
  const { recieverId, recieverName, senderId, senderName } = friendRequest;
  let newFriendRequest = {
    uniqueCombination: `${senderId}:${recieverId}`,
    recieverId: recieverId,
    recieverName: recieverName,
    senderId: senderId,
    senderName: senderName,
  };
  //console.log("newreq", newFriendRequest);
  const query = { uniqueCombination: `${senderId}:${recieverId}` };
  /**restrict duplicate entries due to twice socket listeners call */
  let result = await FriendRequest.findOneAndUpdate(
    { query },
    { $set: newFriendRequest },
    { useFindAndModify: false }
  );
  //console.log("Result::", result);
  if (result == null) {
    try {
      let createdResult = await FriendRequest.create(newFriendRequest);
      console.log("Created:", createdResult);
    } catch (error) {
      console.error("Error::", error.message);
    }
  }
};
