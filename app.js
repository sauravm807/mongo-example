const express = require("express");
const http = require("http");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./src/routes/index");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const { port, db } = require("./src/config");

const app = express();
app.use(logger("dev"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.use("/api", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    code: 400,
    message: err.message,
    error: {},
  });
});
let count = 0;
connect();

function listen() {
  app.set("port", port || 3000);

  app.listen(app.get("port"), function () {
    console.log(`Express server started on port: ` + app.get("port"));
  });
}
function connect() {
  if (count == 5) return;
  mongoose.connection
    .on("error", console.log)
    .on("disconnected", connect)
    .once("open", listen);
  count++;
  return mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
