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

exports.recoverPwdValidation = (req, res, next) => {
  console.log("Recovery Password validation");
  let recoverySchema = joi.object({
    email: joi.string().email().min(5).required(),
  });
  let { error } = recoverySchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json(
        formatResponse(
          true,
          400,
          "Input Param Not Valid",
          error.details[0].message
        )
      );

  next();
};
exports.resetPwdValidation = (req, res, next) => {
  console.log("reset pwd validation");
  let resetPwdSchema = joi.object({
    recoveryCode: joi.string().min(6).required(),
    email: joi.string().email().min(6).required(),
    password: joi
      .string()
      .pattern(new RegExp("^[A-Za-z0-9]\\w{8,64}$"))
      .required(),
  });
  let options = { abortEarly: false };
  let { error } = resetPwdSchema.validate(req.body, options);
  let errorMsg = [];
  if (error) {
    error.details.map((err) => errorMsg.push(err.message));
    return res
      .status(400)
      .json(formatResponse(true, 400, "Input Params Not Valid", errorMsg));
  }
  next();
};

exports.signupParamValidation = (req, res, next) => {
  console.log("signupParamValidation");
  let signUpSchema = joi.object({
    firstName: joi.string().min(4).required(),
    lastName: joi.string().min(4).required(),
    email: joi.string().min(5).email().required(),
    mobile: joi.number().min(10).required(),
    password: joi
      .string()
      .pattern(new RegExp("^[A-Za-z0-9]\\w{8,64}$"))
      .required(),
  });
  let options = { abortEarly: false };
  let { error } = signUpSchema.validate(req.body, options);
  //console.log("validation error", error);
  if (error) {
    let errorMessage = [];
    error.details.map((err) => errorMessage.push(err.message));
    return res.json(
      formatResponse(true, 400, "Not valid Input Params", errorMessage)
    );
  }
  next();
};
