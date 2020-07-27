const mongoose = require("mongoose");

let taskListSchema = mongoose.Schema({
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
});
module.exports = mongoose.model("TaskList", taskListSchema);
