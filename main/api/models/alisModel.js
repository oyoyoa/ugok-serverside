const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const AlisSchema = new Schema({
  //userId: Number,
  alisId: String,
  likes: {
    all: Number,
    half: Number,
    week: Number,
  },
  posts: {
    all: Number,
    half: Number,
    week: Number,
  },
});

module.exports = mongoose.model("Alis", AlisSchema);
