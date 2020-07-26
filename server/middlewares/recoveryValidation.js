const joi = require("@hapi/joi");
const { formatResponse } = require("../library/formatResponse");

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
