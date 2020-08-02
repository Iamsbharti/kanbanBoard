const mongoose = require("mongoose");

const friendRequestSchema = mongoose.Schema({
  uniqueCombination: {
    type: String,
    unique: 1,
  },
  senderId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  recieverId: {
    type: String,
    required: true,
  },
  recieverName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  modifiedOn: {
    type: Date,
  },
});
module.exports = mongoose.model("FriendRequest", friendRequestSchema);
