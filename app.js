const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");

// Connect to database
mongoose
  .connect("mongodb://mongodb:27017/e-commerce")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error.bind(console, "MongoDB connection error:"));

// Launch express
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", userRouter);

module.exports = app;
