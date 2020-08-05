const router = require("express").Router();
const { signUpControl } = require("../controller/signUpControl");
const { loginControl } = require("../controller/loginControl");
const {
  recoverPwdControl,
  resetPassword,
} = require("../controller/recoverPwdControl");
const {
  loginParamValidation,
  recoverPwdValidation,
  resetPwdValidation,
  taskListValidation,
  getTaskListValidation,
  signupParamValidation,
  createTaskValidation,
  createSubTaskValidation,
  getTaskValidation,
  getSubTaskValidation,
  updateTaskListValidation,
  updateTaskValidation,
  updateSubTaskValidation,
  getFriendRequestsValidation,
  revertValidation,
} = require("../middlewares/paramValidation");
const { isAuthorized } = require("../middlewares/authorization");
const {
  createTaskList,
  getAllTaskList,
  createTask,
  createSubTask,
  getAllTasks,
  getSubTasks,
  updateTaskList,
  updateTask,
  updateSubTask,
} = require("../controller/taskListControl");

const { getFriendList } = require("../controller/friendReqSocketControl");
const { revertChanges } = require("../controller/taskMemoryControl");
/**Sign up route */
router.post("/signup", signupParamValidation, signUpControl);
/**login route */
router.post("/login", loginParamValidation, loginControl);
/**Forgot password */
router.post("/recoverPassword", recoverPwdValidation, recoverPwdControl);
/**Reset password */
router.post("/resetPassword", resetPwdValidation, resetPassword);

/*Create TaskList*/
router.post(
  "/createTaskList",
  isAuthorized,
  taskListValidation,
  createTaskList
);
/**get all taskList for a userId */
router.post(
  "/getAllTaskList",
  isAuthorized,
  getTaskListValidation,
  getAllTaskList
);
/**Create task */
router.post("/createTask", isAuthorized, createTaskValidation, createTask);
/**get all tasks for listid and userid */
router.post("/getTasks", isAuthorized, getTaskValidation, getAllTasks);

/**create subtask */
router.post(
  "/createSubTask",
  isAuthorized,
  createSubTaskValidation,
  createSubTask
);
router.post("/getSubTasks", isAuthorized, getSubTaskValidation, getSubTasks);
/**update/delete tasklist*/
router.post(
  "/updateTaskList",
  isAuthorized,
  updateTaskListValidation,
  updateTaskList
);
/**update/delete task */
router.post("/updateTask", isAuthorized, updateTaskValidation, updateTask);
/**update/delete subtask */
router.post(
  "/updateSubTask",
  isAuthorized,
  updateSubTaskValidation,
  updateSubTask
);
/**get friendRequests */
router.post(
  "/getFriendRequests",
  isAuthorized,
  getFriendRequestsValidation,
  getFriendList
);
/**revert changes */
router.post("/revertChanges", isAuthorized, revertValidation, revertChanges);
module.exports = router;
