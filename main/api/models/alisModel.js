const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const AlisSchema = new Schema({
  alisId: { type: String },
  likes: {
    all: { type: Number },
    half: { type: Number },
    week: { type: Number },
  },
  posts: {
    all: { type: Number },
    half: { type: Number },
    week: { type: Number },
  },
});

module.exports = mongoose.model("Alis", AlisSchema);
