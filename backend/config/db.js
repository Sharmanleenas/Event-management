const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error.message);
    console.log("Server will continue running, but database features will be unavailable.");
  }
};

module.exports = connectDB;
