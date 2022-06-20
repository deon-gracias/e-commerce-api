const mongoose = require("mongoose");

// Connect to database
function connectToDB() {
  mongoose
    .connect("mongodb://mongodb:27017/e-commerce", {
      useNewUrlParser: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
}

// Disconnect from database
function disconnectFromDB() {
  mongoose.disconnect();
}

module.exports = { connectToDB };
