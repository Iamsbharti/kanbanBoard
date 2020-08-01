const express = require("express");
const dotenv = require("dotenv");
const router = require("./router/router");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initdb } = require("./initdb");
const { logIp, notfound, handleError } = require("./middlewares/errorHandler");
const { setSocketServer } = require("./library/socketServer");

/**Init Express server & envoirnment variables */
const app = express();
dotenv.config();

/**Init DB */
initdb();

/**Middlewares */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logIp);

/**Set up api route */
let baseurl = process.env.API_VERSION;
app.use(baseurl, router);

/**Error handler */
app.use(notfound);
app.use(handleError);

/**Listener */
const port = process.env.PORT;
let server = app.listen(port, () =>
  console.log("API Server launched at::", port)
);

//Init socket
let socketServerInit = setSocketServer(server);
console.log("Socket Init::", socketServerInit);
