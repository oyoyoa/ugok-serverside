const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const TweetSchema = new Schema({
  //userId: Number,
  twitterId: String,
  screenName: String,
  icon: String,
  likes: {
    all: Number,
    half: Number,
    week: Number,
  },
  rt: {
    all: Number,
    half: Number,
    week: Number,
  },
});

module.exports = mongoose.model("Twitter", TweetSchema);
