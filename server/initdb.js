const mongoose = require("mongoose");

exports.initdb = () => {
  mongoose.connect(process.env.DB_CONNECT, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("error", (error) => {
    console.log("Error connecting DB", error);
  });
  mongoose.connection.on("open", (error) => {
    error
      ? console.log("Error connecting DB", error)
      : console.log("Db Connection Sucess");
  });
};
