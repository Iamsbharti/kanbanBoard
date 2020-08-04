const mongoose = require("mongoose");

let memorySchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  entity: {
    type: String,
    required: true,
  },
  updatedOn: {
    type: Date,
    required: true,
  },
  updateId: {
    type: String,
    required: true,
  },
  operation: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("MemoryTable", memorySchema);
