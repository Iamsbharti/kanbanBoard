const joi = require("@hapi/joi");
const { required } = require("@hapi/joi");
const { formatResponse } = require("../library/formatResponse");

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
