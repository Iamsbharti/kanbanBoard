const mongoose = require("mongoose");

let taskListSchema = mongoose.Schema({
  updateId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  taskId: {
    type: String,
    required: true,
    unique: false,
  },
  userId: {
    type: String,
    required: true,
    unique: false,
  },
  taskListId: {
    type: String,
    required: true,
    unique: false,
  },
  status: {
    type: String,
    unique: false,
  },
  operation: {
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
module.exports = mongoose.model("Historic_Task", taskListSchema);
