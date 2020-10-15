require("dotenv").config();
const mongoose = require("mongoose");
const option = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
const db = mongoose.connection;
// const mongo_pass = process.env.MONGO_PASS;
// const db = process.env.MONGO_DB_NAME;
// const uri = `mongodb://oyoyoa:${mongo_pass}@cluster0.ktjzw.gcp.mongodb.net/${db}?retryWrites=true&w=majority`;
// const MongoClient = require("mongodb").MongoClient;
// const uri =
//   "mongodb+srv://oyoyoa:<password>@cluster0.ktjzw.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, option);
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

module.exports.connectDB = function connectDB() {
  mongoose.connect("mongodb://localhost/test", option);
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("connecting... You can cancel from ctrl + c");
  });
};

module.exports.disconnectDB = function disconnectDB() {
  mongoose.disconnect(() => {
    console.log("disconnected.");
  });
};
