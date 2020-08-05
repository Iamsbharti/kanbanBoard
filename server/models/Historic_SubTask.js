const mongoose = require("mongoose");

let subTaskSchema = mongoose.Schema({
  updateId: {
    type: String,
    unique: true,
  },
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
  userId: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
  },
  updatedOn: {
    type: Date,
  },
});
module.exports = mongoose.model("Historic_SubTask", subTaskSchema);
