const User = require("../models/User");
const shortid = require("shortid");
const { formatResponse } = require("../library/formatResponse");
const { hashPassword } = require("../library/passwordHandler");

exports.signUpControl = async (req, res) => {
  console.log("sign up control");
  const { firstName, lastName, email, mobile, password } = req.body;

  //check for existing email
  const emailExistence = async (email) => {
    //console.log("Email existence", email);
    let userExists = await User.findOne({ email: email });
    if (userExists) {
      return Promise.reject(formatResponse(true, 401, "User Exists", email));
    } else {
      return Promise.resolve();
    }
  };

  //create new schema
  //insert the new user
  const createNewUser = async () => {
    console.log("create new User");
    let newUser = new User({
      userId: shortid.generate(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile,
      password: await hashPassword(password),
    });
    //console.log("new User", newUser);
    let result;
    let user = await User.create(newUser);
    if (user) {
      let _user = user.toObject();
      delete _user._id;
      delete _user.__v;
      delete _user.password;

      result = Promise.resolve(_user);
    } else {
      result = Promise.reject(
        formatResponse(true, 500, "User Create Error", null)
      );
    }
    return result;
  };
  //return response
  /**Sign up func start */
  emailExistence(email)
    .then(createNewUser)
    .then((result) => {
      //console.log("Result", result);
      res
        .status(200)
        .json(formatResponse(false, 200, "User Create Sucess", result));
    })
    .catch((error) => {
      console.log("Error", error);
      res.status(error.status).json(error);
    });

  //  res.send("SignUp works");
};
