const TaskList = require("../models/TaskList");
const shortid = require("shortid");
const { formatResponse } = require("../library/formatResponse");

exports.createTaskList = async (req, res) => {
  console.log("Task List control");
  const { name, userId } = req.body;

  /**Check for existing task name */
  let nameExists = await TaskList.findOne({ name: name, userId: userId });
  if (nameExists)
    return res
      .status(400)
      .json(formatResponse(true, 400, "Task Name already exists", name));

  /**create a new tasklist unique to a userId */
  let newList = new TaskList({
    name: name,
    userId: userId,
    taskListId: shortid.generate(),
  });

  TaskList.create(newList, (error, createdList) => {
    if (error) {
      res
        .status(500)
        .json(formatResponse(true, 500, "Task List Create Error", error));
    } else {
      let response = createdList.toObject();
      delete response.__v;
      delete response._id;
      res
        .status(200)
        .json(formatResponse(false, 200, "Task List Created", response));
    }
  });
};
