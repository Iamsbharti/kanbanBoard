const FriendRequest = require("../models/FriendRequest");
const { formatResponse } = require("../library/formatResponse");
exports.getFriendList = async (req, res) => {
  console.log("Get friend list control");
  const EXCLUDE = "-__v -_id";
  const { senderId } = req.body;
  /**get friend request information */
  const query = { senderId: senderId, recieverId: recieverId };
  FriendRequest.find(query)
    .select(EXCLUDE)
    .lean()
    .exec((error, friendRequests) => {
      console.log("error/FR::", error, friendRequests);
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
    });
};
