const { ConsoleReporter } = require("jasmine");

exports.taskListControl = (req, res) => {
  console.log("Task List control");
  res.send("Task create list works");
};
