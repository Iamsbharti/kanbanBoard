const joi = require("@hapi/joi");
const { formatResponse } = require("../library/formatResponse");

exports.loginParamValidation = (req, res, next) => {
  console.log("Login Param Validation");
  let loginSchema = joi.object({
    email: joi.string().email().min(4).required(),
    password: joi.string().min(8).required(),
  });
  let options = { abortEarly: false };
  let { error } = loginSchema.validate(req.body, options);
  if (error) {
    let errorMsg = [];
    error.details.map((err) => errorMsg.push(err.message));
    return res
      .status(401)
      .json(formatResponse(true, 401, "Not Valid Parameters", errorMsg));
  }
  next();
};
