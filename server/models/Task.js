const mongoose = require("mongoose");

let taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  taskId: {
    type: String,
    required: true,
    unique: true,
  },
  taskListId: {
    type: String,
    required: true,
  },
  userId: {
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
});
module.exports = mongoose.model("Task", taskSchema);
