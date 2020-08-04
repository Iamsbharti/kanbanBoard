const mongoose = require("mongoose");

let taskListSchema = mongoose.Schema({
  updateId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  taskListId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  createdOn: {
    type: Date,
  },
  updatedOn: {
    type: Date,
  },
});
module.exports = mongoose.model("Historic_TaskList", taskListSchema);
