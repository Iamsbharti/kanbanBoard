const jwt = require("jsonwebtoken");
const shortid = require("shortid");

exports.generateTokens = async (userdata, cb) => {
  //console.log("Generate token");
  try {
    let token = {
      jwtid: shortid.generate(),
      iat: Date.now(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 48,
      sub: "authToken",
      iss: "kanbanBoard",
      data: userdata,
    };
    let generatedToken = {
      authToken: jwt.sign(token, process.env.TOKEN_SECRET),
    };
    cb(null, generatedToken);
  } catch (error) {
    //console.log("Error:", error);
    cb(error, null);
  }
};
