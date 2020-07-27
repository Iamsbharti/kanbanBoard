const { ConsoleReporter } = require("jasmine");
const TaskList = require("../models/TaskList");
const shortid = require("shortid");

exports.taskListControl = (req, res) => {
  console.log("Task List control");
  /** */
  res.send("Task create list works");
};
