const mongoose = require("mongoose");

let subTaskSchema = mongoose.Schema({
  updateId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  subTaskId: {
    type: String,
    required: true,
    unique: false,
  },
  taskId: {
    type: String,
    required: true,
    unique: false,
  },
  operation: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: false,
  },
  status: {
    type: String,
    required: true,
    unique: false,
  },
  createdOn: {
    type: Date,
  },
  updatedOn: {
    type: Date,
  },
});
module.exports = mongoose.model("Historic_SubTask", subTaskSchema);
