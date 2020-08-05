const Historic_TaskList = require("../models/Historic_TaskList");
const MemoryTable = require("../models/MemoryTable");
const Historic_SubTask = require("../models/Historic_SubTask");
const Historic_Task = require("../models/Historic_Task");
const TaskList = require("../models/TaskList");
const { formatResponse } = require("../library/formatResponse");
const Task = require("../models/Task");
const SubTask = require("../models/SubTask");

exports.revertChanges = async (req, res) => {
  console.log("revert changes control");
  const { userId } = req.body;
  /**read memory table to fetch the type entity to be
   *  reverted , and take action accordingly
   *
   */
  let revertedSomething = false;
  let toRevert;
  /**fetch memory snapshot and filter out the latest changes done by that id */
  let memorySnapshots = await MemoryTable.find({ userId: userId });
  console.log("memory snapshots::", memorySnapshots);
  /**filter out the latest changes done by that id */
  if (memorySnapshots.length !== 0) {
    toRevert = memorySnapshots.reduce(function (prev, current) {
      return prev.y < current.y ? prev : current;
    });
  } else {
    return res
      .status(404)
      .json(formatResponse(true, 404, "No Historic Data Found", null));
  }

  /**destructure data from memory map to find out appropiate entity and take actions */
  const { entity, updatedOn, updateId, operation } = toRevert;
  console.log("revert--values::", entity, updatedOn, updateId, operation);

  /**utility method to delete the memory snapshot and Historic data */
  const deleteRevertedMemory = async (snapshot, historicData, entitySchema) => {
    console.log(
      "Delete Memory SnapShots Start::",
      snapshot,
      historicData[0].updateId,
      entitySchema
    );
    /**delete memory table */
    let deleteMemoryTable = await MemoryTable.deleteOne({
      updateId: snapshot.updateId,
    });
    console.log("Deleted Memory Table::", deleteMemoryTable.n);
    /**delete historic entity */
    let deleteHistoricData = await entitySchema.deleteOne({
      updateId: historicData[0].updateId,
    });
    console.log("Deleted Historic_Entity::", deleteHistoricData.n);
    console.log("DELETE MEMORY-MAP COMPLETE_________");
  };

  /**fetch the appropiate entity and update the same to existing Collection*/
  if (entity === "TaskList") {
    console.log("Reverting TaskList:::");

    let historicTaskList = await Historic_TaskList.find({
      updateId: updateId,
    })
      .lean()
      .exec();

    if (operation === "create") {
      let { taskListId, userId } = historicTaskList[0];
      console.log("creates ops -->deleteting:", taskListId, userId);
      /**delete the entity if ops is create */
      let deletedTaskList = await TaskList.deleteOne({
        taskListId: taskListId,
        userId: userId,
      });
      revertedSomething = true;
      console.log("Deleted the created historic tasklist", deletedTaskList.n);
    }
    if (operation === "edit") {
      let { name, userId, taskListId } = historicTaskList[0];
      console.log("edit ops -->updating::", name, userId, taskListId);
      /**revert the old/history name */
      let query = { taskListId: taskListId, userId: userId };
      let update = { name: name };
      let updatedTaskList = await TaskList.updateOne(query, update);
      console.log("Update historic task::", updatedTaskList.n);
      revertedSomething = true;
    }
    if (operation === "delete") {
      let { name, taskListId, userId } = historicTaskList[0];
      console.log("delete  ops -->creating");
      /**create the deleted tasklist */
      let newTaskListSchema = new TaskList({
        taskListId: taskListId,
        userId: userId,
        name: name,
      });
      let createdTaskList = await TaskList.create(newTaskListSchema);
      console.log("created the deleted tasklist::", createdTaskList.taskListId);
      revertedSomething = true;
    }
    /**clean memorysnapshot and corresposing Hitoric entry post revert*/
    deleteRevertedMemory(toRevert, historicTaskList, Historic_TaskList);
  }
  if (entity === "Task") {
    console.log("Reverting Task:::", updateId);
    let historicTask = await Historic_Task.find({
      updateId: updateId,
    })
      .lean()
      .exec();

    if (operation === "create") {
      let { userId, taskId } = historicTask[0];
      console.log("creates ops -->deleteting::", userId, taskId);
      /**delete the entity if ops is create */
      let deletedTask = await Task.deleteOne({
        taskId: taskId,
        userId: userId,
      });
      console.log("Deleted the created historic task", deletedTask.n);
      revertedSomething = true;
    }
    if (operation === "edit") {
      let { name, status, userId, taskId } = historicTask[0];
      console.log("edit ops -->updating::", name, status, userId, taskId);
      /**revert the old/history name */
      let query = { taskId: taskId, userId: userId };
      let update = { name: name, status: status };
      let updatedTask = await Task.updateOne(query, update);
      console.log("Update historic task::", updatedTask.n);
      revertedSomething = true;
    }
    if (operation === "delete") {
      let { name, status, userId, taskId, taskListId } = historicTask[0];
      console.log("delete  ops -->creating::", name, status, userId, taskId);
      /**create the deleted tasklist */
      let newTaskSchema = new Task({
        taskListId: taskListId,
        userId: userId,
        name: name,
        status: status,
        taskId: taskId,
      });
      let createdTask = await Task.create(newTaskSchema);
      console.log("created the deleted tasklist::", createdTask.taskId);
      revertedSomething = true;
    }
    /**clean memorysnapshot and corresposing Hitoric entry post revert*/
    deleteRevertedMemory(toRevert, historicTask, Historic_Task);
  }
  if (entity === "SubTask") {
    console.log("Reverting SubTask:::");
    let historicSubTask = await Historic_SubTask.find({
      updateId: updateId,
    })
      .lean()
      .exec();

    if (operation === "create") {
      let { userId, subTaskId, taskId } = historicSubTask[0];
      console.log("to--delete-subtask:", userId, subTaskId, taskId);
      console.log("creates ops -->deleteting");
      /**delete the entity if ops is create */
      let deletedSubTask = await SubTask.deleteOne({
        subTaskId: subTaskId,
        userId: userId,
        taskId: taskId,
      });
      console.log("Deleted the created historic subtask", deletedSubTask.n);
      revertedSomething = true;
    }
    if (operation === "edit") {
      let { name, status, userId, subTaskId, taskId } = historicSubTask[0];
      console.log(
        "edit ops -->updating::",
        name,
        status,
        userId,
        subTaskId,
        taskId
      );
      /**revert the old/history name */
      let query = { subTaskId: subTaskId, userId: userId };
      let update = { name: name, status: status, taskId: taskId };
      let updatedTask = await SubTask.updateOne(query, update);
      console.log("Update historic subtask::", updatedTask.n);
      revertedSomething = true;
    }
    if (operation === "delete") {
      let { name, status, userId, subTaskId, taskId } = historicSubTask[0];
      console.log(
        "delete  ops -->creating::",
        name,
        status,
        userId,
        subTaskId,
        taskId
      );
      /**create the deleted tasklist */
      let newTaskSchema = new SubTask({
        subTaskId: subTaskId,
        userId: userId,
        name: name,
        status: status,
        taskId: taskId,
      });
      let createdSubTask = await SubTask.create(newTaskSchema);
      console.log("created the deleted subtask::", createdSubTask.subTaskId);
      revertedSomething = true;
    }
    /**clean memorysnapshot and corresposing Hitoric entry post revert*/
    deleteRevertedMemory(toRevert, historicSubTask, Historic_SubTask);
  }
  if (toRevert.length === 0) {
    res
      .status(404)
      .json(formatResponse(true, 404, "No Historic Data Found", toRevert));
  } else if (revertedSomething) {
    res
      .status(200)
      .json(formatResponse(false, 200, "Revert Success", toRevert));
  }
};
