const mongoose = require("mongoose");

// Connect to database
module.exports.connectToDB = function () {
  mongoose
    .connect("mongodb://mongodb:27017/e-commerce", {
      useNewUrlParser: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
};
