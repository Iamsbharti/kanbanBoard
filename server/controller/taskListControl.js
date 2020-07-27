const TaskList = require("../models/TaskList");
const shortid = require("shortid");
const { formatResponse } = require("../library/formatResponse");
const Task = require("../models/Task");
const SubTask = require("../models/SubTask");
const EXCLUDE = "-__v -_id";
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
exports.getAllTaskList = async (req, res) => {
  console.log("get all task list control");
  const { userId } = req.body;
  /**fetch all task list for the userid */
  TaskList.find({ userId: userId })
    .select(EXCLUDE)
    .lean()
    .exec((error, allList) => {
      console.log("error", error, allList);
      if (error) {
        res
          .status(500)
          .json(formatResponse(true, 500, "Error Fetching TaskLists", error));
      } else {
        res
          .status(200)
          .json(formatResponse(false, 200, "Task List Fetched", allList));
      }
    });
};
exports.createTask = async (req, res) => {
  console.log("create task control");
  const { name, userId, taskListId, status } = req.body;
  /**check for existing name */
  let taskNameExists = await Task.findOne({
    name: name,
    taskListId: taskListId,
    userId: userId,
  });
  if (taskNameExists)
    return res
      .status(400)
      .json(formatResponse(true, 400, "Task Name Exists", name));

  /**Create new task */
  let newTask = new Task({
    name: name,
    taskId: shortid.generate(),
    taskListId: taskListId,
    userId: userId,
    status: status,
  });
  Task.create(newTask, (error, createdTask) => {
    if (error) {
      res
        .status(500)
        .json(formatResponse(true, 500, "Error creating Task", error));
    } else {
      let response = createdTask.toObject();
      delete response._id;
      delete response.__v;
      res
        .status(200)
        .json(formatResponse(false, 200, "Task Created", response));
    }
  });
};
exports.createSubTask = async (req, res) => {
  console.log("Create subtask control");
  const { name, taskId, status } = req.body;
  /**Check for existing subtask name */
  let subTaskExists = await SubTask.findOne({ name: name, taskId: taskId });
  if (subTaskExists)
    return res
      .status(400)
      .json(formatResponse(true, 400, "Sub Task Name Exists", name));

  /**Create new subtask */
  let newSubTask = new SubTask({
    name: name,
    subTaskId: shortid.generate(),
    taskId: taskId,
    status: status,
  });
  SubTask.create(newSubTask, (error, createdSubTask) => {
    if (error) {
      res
        .status(500)
        .json(formatResponse(true, 500, "SubTask Creation Error", error));
    } else {
      let response = createdSubTask.toObject();
      delete response._id;
      delete response.__v;
      res
        .status(200)
        .json(formatResponse(false, 200, "Sub Task Created", response));
    }
  });
};
