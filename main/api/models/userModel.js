const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  twitterId: { type: Schema.Types.ObjectId, ref: "Twitter" },
  alisId: { type: Schema.Types.ObjectId, ref: "Alis" },
});

module.exports = mongoose.model("User", UserSchema);
