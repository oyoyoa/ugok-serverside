require("dotenv").config();
const mongoose = require("mongoose");
const option = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
const db = mongoose.connection;
const mongo_pass = process.env.MONGO_PASS;
const db_name = process.env.MONGO_DB_NAME;
const uri = `mongodb+srv://oyoyoa:${mongo_pass}@testugok.zrxlt.mongodb.net/${db_name}?retryWrites=true&w=majority`;
module.exports.connectDB = function connectDB() {
  mongoose.connect(uri, option).catch((err) => console.log(err.reason));
    // db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("connecting... You can cancel from ctrl + c");
  });
};

module.exports.disconnectDB = function disconnectDB() {
  mongoose.disconnect(() => {
    console.log("disconnected.");
  });
};
