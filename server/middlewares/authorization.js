const jwt = require("jsonwebtoken");
const { formatResponse } = require("../library/formatResponse");

exports.isAuthorized = (req, res, next) => {
  //console.log("Is authorized middleware");
  const reqBodyAuth = req.body.authToken;
  const reqQueryAuth = req.query.authToken;
  const reqHeaderAuth = req.header("authToken");
  //console.log("authtoken", reqBodyAuth, reqHeaderAuth, reqQueryAuth);
  if (
    reqBodyAuth !== undefined ||
    reqQueryAuth !== undefined ||
    reqHeaderAuth !== undefined
  ) {
    //console.log("if-auth");
    let decoded = jwt.verify(
      reqBodyAuth || reqQueryAuth || reqHeaderAuth,
      process.env.TOKEN_SECRET
    );
    console.log("Decoded", decoded.data.email);
  } else {
    //console.log("no auth");
    return res
      .status(400)
      .json(formatResponse(true, 400, "AuthToken Missing", null));
  }
  next();
};
