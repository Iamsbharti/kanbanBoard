const jwt = require("jsonwebtoken");
const { formatResponse } = require("../library/formatResponse");

exports.isAuthorized = (req, res, next) => {
  console.log("Is authorized middleware");
  const reqBodyAuth = req.body.authToken;
  const reqQueryAuth = req.query.authToken;
  const reqHeaderAuth = req.header("authToken");
  //console.log("authtoken", reqBodyAuth, reqHeaderAuth, reqQueryAuth);
  if (
    reqBodyAuth !== undefined ||
    reqBodyAuth !== null ||
    reqQueryAuth !== undefined ||
    reqQueryAuth !== null ||
    reqHeaderAuth !== undefined ||
    reqHeaderAuth !== null
  ) {
    let decoded = jwt.verify(
      reqBodyAuth || reqQueryAuth || reqHeaderAuth,
      process.env.TOKEN_SECRET
    );
    console.log("Decoded", decoded);
  } else {
    return res
      .status(400)
      .json(formatResponse(true, 400, "AuthToken Missing", null));
  }
  next();
};
