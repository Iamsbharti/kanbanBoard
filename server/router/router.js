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
} = require("../middlewares/paramValidation");
const { isAuthorized } = require("../middlewares/authorization");
const {
  createTaskList,
  getAllTaskList,
  createTask,
  createSubTask,
} = require("../controller/taskListControl");

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
/**create subtask */
router.post(
  "/createSubTask",
  isAuthorized,
  createSubTaskValidation,
  createSubTask
);
module.exports = router;
