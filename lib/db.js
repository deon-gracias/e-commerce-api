const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI || "mongodb://mongodb:27017/e-commerce";

// Connect to database
function connectToDB() {
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
}

// Disconnect from database
function disconnectFromDB() {
  mongoose.disconnect();
}

module.exports = { connectToDB, disconnectFromDB };
