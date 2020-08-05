const mongoose = require("mongoose");

let subTaskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subTaskId: {
    type: String,
    required: true,
    unique: true,
  },
  taskId: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  updatedOn: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("SubTask", subTaskSchema);
