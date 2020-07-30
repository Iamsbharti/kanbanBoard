const TaskList = require("../models/TaskList");
const shortid = require("shortid");
const { formatResponse } = require("../library/formatResponse");
const Task = require("../models/Task");
const SubTask = require("../models/SubTask");
const User = require("../models/User");
const { convertCompilerOptionsFromJson, Extension } = require("typescript");
const { update } = require("../models/TaskList");
const { query } = require("express");
const EXCLUDE = "-__v -_id";

/**Check for valid userId */
const validUserId = async (userId) => {
  console.log("validate UserId:", userId);
  let validuserId = await User.findOne({ userId: userId });
  return !validuserId
    ? formatResponse(true, 404, "UserId Not Found", userId)
    : true;
};
/**Check for valid taskListId */
const validTaskListId = async (taskListId) => {
  console.log("validate tasklist id:", taskListId);
  let validTaskListId = await TaskList.findOne({ taskListId: taskListId });
  return !validTaskListId
    ? formatResponse(true, 404, "TaskListId Not Found", taskListId)
    : true;
};
/**check for valid taskId */
const validTaskId = async (taskId) => {
  console.log("validate taskid::", taskId);
  let validtaskId = await Task.findOne({ taskId: taskId });
  return !validtaskId
    ? formatResponse(true, 404, "TaskId Not Found", taskId)
    : true;
};
exports.createTaskList = async (req, res) => {
  console.log("Task List control");
  const { name, userId } = req.body;
  /**Verify userId */
  let isUserIdValid = await validUserId(userId);
  console.log("isUserIdValid::", isUserIdValid);
  if (isUserIdValid.error)
    return res.status(isUserIdValid.status).json(isUserIdValid);
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
    console.log("error", error, createdList);
    if (error !== null) {
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

  /**Verify userId */
  let isUserIdValid = await validUserId(userId);
  console.log("isUserIdValid::", isUserIdValid);
  if (isUserIdValid.error)
    return res.status(isUserIdValid.status).json(isUserIdValid);

  /**fetch all task list for the userid */
  TaskList.find({ userId: userId })
    .select(EXCLUDE)
    .lean()
    .exec((error, allList) => {
      console.log("error", error, allList);
      if (error !== null) {
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

  /**verify taskListId */
  let isTaskListValid = await validTaskListId(taskListId);
  console.log("isTaskListValid::", isTaskListValid);
  if (isTaskListValid.error)
    return res.status(isTaskListValid.status).json(isTaskListValid);

  /**Verify userId */
  let isUserIdValid = await validUserId(userId);
  console.log("isUserIdValid::", isUserIdValid);
  if (isUserIdValid.error)
    return res.status(isUserIdValid.status).json(isUserIdValid);

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
    console.log("error", error, createdTask);
    if (error !== null) {
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
exports.getAllTasks = async (req, res) => {
  console.log("get all tasks control");
  const { taskListId, userId } = req.body;

  /**verify taskListId */
  let isTaskListValid = await validTaskListId(taskListId);
  console.log("isTaskListValid::", isTaskListValid);
  if (isTaskListValid.error)
    return res.status(isTaskListValid.status).json(isTaskListValid);

  /**Verify userId */
  let isUserIdValid = await validUserId(userId);
  console.log("isUserIdValid::", isUserIdValid);
  if (isUserIdValid.error)
    return res.status(isUserIdValid.status).json(isUserIdValid);

  /**fetch all tasks realated to listId and UserId */
  let query = { taskListId: taskListId, userId: userId };
  Task.find(query)
    .select(EXCLUDE)
    .lean()
    .exec((error, allTasks) => {
      console.log("error", error, allTasks);
      if (error !== null) {
        res
          .status(500)
          .json(formatResponse(true, 500, "Error Fetching Tasks", error));
      } else {
        res
          .status(200)
          .json(formatResponse(false, 200, "Fetched Tasks", allTasks));
      }
    });
};
exports.createSubTask = async (req, res) => {
  console.log("Create subtask control");
  const { name, taskId, status } = req.body;

  /**check for valid taskId */
  let isTaskIdValid = await validTaskId(taskId);
  console.log("isTaskIdValid::", isTaskIdValid);
  if (isTaskIdValid.error)
    return res.status(isTaskIdValid.status).json(isTaskIdValid);

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
    console.log("error", error, createdSubTask);
    if (error !== null) {
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
exports.getSubTasks = async (req, res) => {
  console.log("get all subtasks control");
  const { taskId } = req.body;

  /**check for valid taskId */
  let isTaskIdValid = await validTaskId(taskId);
  console.log("isTaskIdValid::", isTaskIdValid);
  if (isTaskIdValid.error)
    return res.status(isTaskIdValid.status).json(isTaskIdValid);

  /**fetch all subtasks for a taskid */
  SubTask.find({ taskId: taskId })
    .select(EXCLUDE)
    .lean()
    .exec((error, allsubTasks) => {
      console.log("error", error, allsubTasks);
      if (error !== null) {
        res
          .status(500)
          .json(formatResponse(true, 500, "Error Fetching Subtasks", error));
      } else {
        res
          .status(200)
          .json(formatResponse(false, 200, "Fetched Subtasks", allsubTasks));
      }
    });
};
exports.updateTaskList = async (req, res) => {
  console.log("Update task list control:");
  const { update, taskListId, operation, userId } = req.body;
  console.log(update, taskListId, operation);

  /**verify taskListId */
  let isTaskListValid = await validTaskListId(taskListId);
  console.log("isTaskListValid::", isTaskListValid);
  if (isTaskListValid.error)
    return res.status(isTaskListValid.status).json(isTaskListValid);

  /**Verify userId */
  let isUserIdValid = await validUserId(userId);
  console.log("isUserIdValid::", isUserIdValid);
  if (isUserIdValid.error)
    return res.status(isUserIdValid.status).json(isUserIdValid);

  /**based on operation value */
  if (operation === "edit") {
    //Update lastlist name
    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json(
          formatResponse(true, 400, "Noting to update", "pass valid property")
        );
    } else {
      let query = { taskListId: taskListId, userId: userId };
      TaskList.updateOne(query, update, (error, updatedList) => {
        console.log("updated list::", error, updatedList);
        if (error !== null) {
          res
            .status(500)
            .json(formatResponse(true, 500, "TaskList Update Error", null));
        } else {
          let { n } = updatedList;
          console.log("Updated--", n);
          res
            .status(200)
            .json(
              formatResponse(false, 200, "TaskList Updated", `${n}-doc updated`)
            );
        }
      });
    }
  }
  if (operation === "delete") {
    console.log("delete task and related task and subtasks");
    let query = { taskListId: taskListId, userId: userId };
    /**find taskId and to delete it's subtasks */
    console.log("Fetching task ids for userid and taskList Id");
    let taskDetails = await Task.find(query).select("taskId").lean().exec();
    let taskIdsArray = [];
    console.log("taskDetails::", taskDetails);
    taskDetails.map((task) => taskIdsArray.push(task.taskId));
    console.log("TasksIds::", taskIdsArray);

    /**delete subtasks based on taskid */
    console.log("Deleting subtasks based on fetched taskId");
    taskIdsArray.map((task) =>
      SubTask.deleteMany({ taskId: task.taskId }, (error, deleted) => {
        if (error !== null) {
          console.log("Error deleting SubTasks::", error);
        } else {
          let { n } = deleted;
          console.log("Subtask Delted::", `${n}-docs deleted`);
        }
      })
    );
    /**delete tasks based on userid and taskListID */
    console.log("sub tasks deleted now deleting tasks");
    let deletedTask = await Task.deleteMany(query);
    console.log(
      "Deleted task before deleting tasklist::",
      deletedTask.n + "-docs deleted"
    );
    /**delete taskList */
    console.log("Dependencies deleted ,now delete tasklist");
    TaskList.deleteOne(query, (error, deletedList) => {
      console.log("Error-deleted::", error, deletedList);
      if (error != null) {
        res
          .status(500)
          .json(formatResponse(true, 500, "TaskLIst Delete Error", error));
      } else {
        let { n } = deletedList;
        res
          .status(200)
          .json(
            formatResponse(false, 200, "TaskList deleted", `${n}-docs deleted`)
          );
      }
    });
  }
};
exports.updateTask = async (req, res) => {
  console.log("Update task control::");
  const { taskListId, userId, taskId, update, operation } = req.body;
  /**verify taskListId */
  let isTaskListValid = await validTaskListId(taskListId);
  console.log("isTaskListValid::", isTaskListValid);
  if (isTaskListValid.error)
    return res.status(isTaskListValid.status).json(isTaskListValid);

  /**Verify userId */
  let isUserIdValid = await validUserId(userId);
  console.log("isUserIdValid::", isUserIdValid);
  if (isUserIdValid.error)
    return res.status(isUserIdValid.status).json(isUserIdValid);

  /**check for valid taskId */
  let isTaskIdValid = await validTaskId(taskId);
  console.log("isTaskIdValid::", isTaskIdValid);
  if (isTaskIdValid.error)
    return res.status(isTaskIdValid.status).json(isTaskIdValid);

  let query = { taskListId: taskListId, userId: userId, taskId: taskId };
  if (operation === "edit") {
    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json(
          formatResponse(true, 400, "Noting to update", "pass valid property")
        );
    } else {
      console.log("Final update option::", update);
      Task.updateOne(query, update, (error, updatedTask) => {
        if (error !== null) {
          res
            .status(500)
            .json(formatResponse(true, 500, "Error Updating Task", error));
        } else {
          let { n } = updatedTask;
          res
            .status(200)
            .json(
              formatResponse(false, 200, "Task Updated", `${n}-doc updated`)
            );
        }
      });
    }
  }
  if (operation === "delete") {
    console.log("Delete task");
    /**delete/cleanup subsequent subtasks */
    let deletedSubTasks = await SubTask.deleteMany({ taskId: taskId });
    deletedSubTasks &&
      Task.deleteOne(query, (error, deletedTask) => {
        if (error !== null) {
          res
            .status(500)
            .json(formatResponse(true, 500, "Error Deleting Task", error));
        } else {
          let { n } = deletedTask;
          res
            .status(200)
            .json(
              formatResponse(false, 200, "Task Deleted", `${n}-doc deleted`)
            );
        }
      });
  }
};
exports.updateSubTask = async (req, res) => {
  console.log("Update sub task control::");
  const { subTaskId, taskId, update, operation } = req.body;
  /**----Sanity check--------------- */
  /**check for valid taskId */
  let isTaskIdValid = await validTaskId(taskId);
  console.log("isTaskIdValid::", isTaskIdValid);
  if (isTaskIdValid.error)
    return res.status(isTaskIdValid.status).json(isTaskIdValid);
  /**check for valid subtaskid */
  let subTaskExists = await SubTask.findOne({ subTaskId: subTaskId });
  if (!subTaskExists) {
    return res
      .status(404)
      .json(formatResponse(true, 404, "SubTask Id Not Found", subTaskId));
  }

  /**Check passed start operation */
  /**operation based flow */
  let query = { taskId: taskId, subTaskId: subTaskId };
  /**update subtask */
  if (operation === "edit") {
    /**check for empty update object */
    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json(
          formatResponse(true, 400, "Noting to update", "pass valid property")
        );
    } else {
      console.log("Final update option::", update);
      SubTask.updateOne(query, update, (error, updatedSubTask) => {
        if (error !== null) {
          res
            .status(500)
            .json(formatResponse(true, 500, "Error Updating Task", error));
        } else {
          let { n } = updatedSubTask;
          res
            .status(200)
            .json(
              formatResponse(false, 200, "SubTask Updated", `${n}-doc updated`)
            );
        }
      });
    }
  }
  /**delete subtask */
  if (operation === "delete") {
    console.log("Delete subtask");
    SubTask.deleteOne(query, (error, deletedSubTask) => {
      if (error !== null) {
        res
          .status(500)
          .json(formatResponse(true, 500, "Error Deleting Task", error));
      } else {
        let { n } = deletedSubTask;
        res
          .status(200)
          .json(
            formatResponse(false, 200, "SubTask Deleted", `${n}-doc deleted`)
          );
      }
    });
  }
};
