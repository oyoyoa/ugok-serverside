require("dotenv").config();
const mongoose = require("mongoose");
const db = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("Mongodb is connected....");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
