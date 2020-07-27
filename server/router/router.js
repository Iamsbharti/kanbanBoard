const router = require("express").Router();
const { signUpControl } = require("../controller/signUpControl");
const { signupParamValidation } = require("../middlewares/paramValidation");
const { loginControl } = require("../controller/loginControl");
const { loginParamValidation } = require("../middlewares/paramValidation");
const {
  recoverPwdControl,
  resetPassword,
} = require("../controller/recoverPwdControl");
const {
  recoverPwdValidation,
  resetPwdValidation,
} = require("../middlewares/paramValidation");
const { isAuthorized } = require("../middlewares/authorization");
const { taskListParamValidation } = require("../middlewares/paramValidation");
const { taskListControl } = require("../controller/taskListControl");

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
  taskListParamValidation,
  taskListControl
);
module.exports = router;
