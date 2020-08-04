const { generateTokens } = require("../library/autenticationCode");
const { formatResponse } = require("../library/formatResponse");
const User = require("../models/User");
const { comparePassword } = require("../library/passwordHandler");

exports.loginControl = async (req, res) => {
  //console.log("Login Control");

  const { email, password } = req.body;
  //emailexistence
  const emailExistence = async (email) => {
    // //console.log("Email Existence", email);
    let userExists = await User.findOne({ email: email });
    if (!userExists) {
      return Promise.reject(formatResponse(true, 404, "User Not Found", email));
    } else {
      return Promise.resolve(userExists);
    }
  };
  //comparepassword
  const validateCredentials = async (foundUser) => {
    //console.log("Validate credentials");
    let validCred = await comparePassword(password, foundUser.password);
    ////console.log("valid cred", validCred);
    if (validCred) {
      let _userData = foundUser.toObject();
      delete _userData.password;
      delete _userData.__v;
      delete _userData._id;
      delete _userData.passwordRecoverCode;
      let friendList = _userData.friends;
      friendList.map((fr, i) => {
        if (fr === _userData.userId) {
          delete _userData.friends[i];
        }
      });
      console.log(_userData.friends);
      return Promise.resolve(_userData);
    } else {
      return Promise.reject(formatResponse(true, 401, "Login Failed", null));
    }
  };
  //generatetoken
  const generateToken = async (userData) => {
    //console.log("generateToken");
    let result;
    generateTokens(userData, (error, tokenDetails) => {
      ////console.log("Error/token", error);
      if (error) {
        result = Promise.reject(
          formatResponse(true, 500, "Token Generation Error", null)
        );
      } else {
        result = Promise.resolve({
          ...userData,
          authToken: tokenDetails.authToken,
        });
      }
    });
    return result;
  };

  /**Login controller start */
  emailExistence(email)
    .then(validateCredentials)
    .then(generateToken)
    .then((result) => {
      ////console.log("login result");
      res.header("authToken", result.authToken);
      res.status(200).json(formatResponse(false, 200, "Login Sucess", result));
    })
    .catch((error) => {
      //console.log("Error", error);
      res.status(error.status).json(error);
    });
  //sendresponse
  //res.send("Login works");
};
