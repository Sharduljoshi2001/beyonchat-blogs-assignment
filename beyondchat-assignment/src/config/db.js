const mongoose = require("mongoose");
//function to connect db
const connectDB = async () => {
  try {
    //trying to connect using url from .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected successfully");
  } catch (error) {
    // if connection fails, show error
    console.log("database connection failed", error);
    // stop the process if db is not connecting
    process.exit(1);
  }
};
module.exports = connectDB;