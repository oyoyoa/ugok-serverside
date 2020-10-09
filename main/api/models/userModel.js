const mongoose = require("mongoose"),
  Twitter = require("./api/models/tweetModel"),
  Alis = require("./api/models/aliskModel"),
  Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: Number,
  name: String,
  twitter: Twitter,
  alis: Alis,
});

module.exports = mongoose.model("User", UserSchema);
