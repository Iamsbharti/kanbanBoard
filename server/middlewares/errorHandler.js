const { formatResponse } = require("../library/formatResponse");

exports.logIp = async (req, res, next) => {
  let path = req.originalUrl;
  let method = req.method;
  let ip = req.ip;
  let protocol = req.protocol;
  console.log(
    `${method} requested by - ${ip} for path -${path} using ${protocol}`
  );
  next();
};
exports.notfound = (req, res, next) => {
  res.status(404).json(formatResponse(true, 404, "Path Not Found", req.path));
  next();
};
exports.handleError = (error, req, res, next) => {
  res
    .status(500)
    .json(formatResponse(true, 500, "Internal Server Error", error));

  next();
};
