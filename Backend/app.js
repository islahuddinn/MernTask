const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user.routes");
const { noteRouter } = require("./routes/note.routes");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
require("dotenv").config();

const app = express();

//1) GLOBAL MIDDLEWARES
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(xss());

app.use((req, res, next) => {
  console.log("Hey, from middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  console.log(req.headers);
  next();
});

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/note", noteRouter);

app.get("/api", (req, res) => {
  res.send({
    message: "API is working now",
  });
});

module.exports = app;
