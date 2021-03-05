const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const TwitterSchema = new Schema({
  twitterId: { type: String, required: true },
  screenName: { type: String, required: true },
  icon: { type: String },
  posts: {
    all: { type: Number },
    half: { type: Number },
    week: { type: Number },
  },
  likes: {
    all: { type: Number },
    half: { type: Number },
    week: { type: Number },
  },
  rt: {
    all: { type: Number },
    half: { type: Number },
    week: { type: Number },
  },
});

module.exports = mongoose.model("Twitter", TwitterSchema);
