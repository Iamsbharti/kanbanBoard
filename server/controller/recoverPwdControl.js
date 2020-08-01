const User = require("../models/User");
const { formatResponse } = require("../library/formatResponse");
const { hashPassword } = require("../library/passwordHandler");
const nodemailer = require("nodemailer");
const { format } = require("path");
//emailExistence
const emailExistence = async (email) => {
  let userExists = await User.findOne({ email: email });
  if (userExists) {
    return Promise.resolve(userExists);
  } else {
    return Promise.reject(formatResponse(true, "404", "User Not Found", null));
  }
};

exports.recoverPwdControl = async (req, res) => {
  console.log("Recover Password control");
  const { email } = req.body;
  //generate random code and save against users' recoveryCode
  const generateRecoveryCode = async (foundUser) => {
    let recoveryCode = parseInt(Math.random() * 1000000, 10);
    //console.log("Recovery Code", recoveryCode);
    let query = { email: foundUser.email };
    let update = { passwordRecoverCode: recoveryCode };
    let recoveryResponse;
    let { n } = await User.updateOne(query, update);
    /*User.updateOne(query, update, (error, n) => {
      console.log("updatederror", `${n.n} updated--${error}`);
      if (error !== null) {
        recoveryResponse = Promise.reject(
          formatResponse(true, 500, "Recover Code gen Error", error)
        );
      } else {
        console.log("updated code");
        let result = {
          updated: n.n,
          email: email,
          recoveryCode: recoveryCode,
        };
        console.log("finalres", result);
        recoveryResponse = Promise.resolve(result);
      }
    });*/
    //console.log("updated recovery code", n);
    if (n === 1) {
      //console.log("updated code");
      let result = {
        updated: n.n,
        email: email,
        recoveryCode: recoveryCode,
      };
      //console.log("finalres", result);
      recoveryResponse = Promise.resolve(result);
    } else {
      recoveryResponse = Promise.reject(
        formatResponse(true, 500, "Recover Code gen Error", error)
      );
    }
    return recoveryResponse;
  };
  //send code to mail
  const sendEmail = async (result) => {
    //console.log("send email", result);
    let sendEmailResult;
    //construst transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });
    //configure mail options
    let emailText = `
      <h1>You Requested for Password Recovery</h1>
      <code>Use this code to reset you password</code>
      <h3>Recovery Code - ${result.recoveryCode}</h3>
    `;
    let mailOptions = {
      from: "kanbanboard.test@gmail.com",
      to: result.email,
      subject: "Recover Password Kanboard",
      html: emailText,
    };
    //send email
    let data = await transporter.sendMail(mailOptions);
    //console.log("res", data);
    if (data) {
      sendEmailResult = Promise.resolve({
        ...result,
        Operation: "Email Sent",
      });
    } else {
      sendEmailResult = Promise.reject(
        formatResponse(true, 500, "Internal Server Error", {
          ...result,
          Operation: "Email Send Error",
        })
      );
    }
    return sendEmailResult;
  };
  /**recovery starts */
  emailExistence(email)
    .then(generateRecoveryCode)
    .then(sendEmail)
    .then((result) => {
      //console.log("Recovery code Result", result);
      res
        .status(200)
        .json(formatResponse(false, 200, "Recovery Sucess", result));
    })
    .catch((error) => {
      console.log("Error", error);
      res.status(error.status).json(error);
    });
  //res.send("Recover password success");
};
exports.resetPassword = async (req, res) => {
  console.log("validate recovery code and reset Password");
  const { recoveryCode, email, password } = req.body;

  //validate recoverycode
  const validateCode = async (foundUser) => {
    //console.log("validate code", foundUser.passwordRecoverCode, recoveryCode);
    let validateRes;
    validateRes =
      recoveryCode === foundUser.passwordRecoverCode
        ? Promise.resolve(foundUser)
        : Promise.reject(
            formatResponse(true, 400, "Not Valid RecoveryCode", null)
          );

    return validateRes;
  };
  //reset password and recovery code
  const resetPassword = async (foundUser) => {
    console.log("reset password");
    let query = { email: foundUser.email };
    let update = {
      password: await hashPassword(password),
      passwordRecoverCode: "",
    };
    let resetResult;
    await User.updateOne(query, update, (error, n) => {
      console.log("Password Update", `${n.n}-updated--${error}`);
      if (error !== null) {
        resetResult = Promise.reject(true, 500, "Internal Server Error", error);
      } else {
        let result = {
          updated: n.n,
          email: foundUser.email,
        };
        resetResult = Promise.resolve(result);
      }
    });
    return resetResult;
  };

  /**Reset Password starts */
  emailExistence(email)
    .then(validateCode)
    .then(resetPassword)
    .then((result) => {
      //console.log("Result", result);
      res
        .status(200)
        .json(formatResponse(false, 200, "Password Reset Success", result));
    })
    .catch((error) => {
      console.log("Error", error);
      res.status(error.status).json(error);
    });
  //res.send("Reset Works");
};
