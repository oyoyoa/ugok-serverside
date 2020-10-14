const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const TwitterSchema = new Schema({
  twitterId: { type: String },
  screenName: { type: String },
  icon: { type: String },
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
