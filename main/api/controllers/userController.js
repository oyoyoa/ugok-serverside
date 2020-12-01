const User = require("../models/userModel.js");
const Twitter = require("../models/twitterModel.js");
const Alis = require("../models/alisModel.js");

// 全てのユーザーを取得する。
exports.showAllUsers = async (req, res) => {

  await User.find().lean().exec(async(err, users) => {
    if (err) res.send(err);
    users.forEach( async(user) => {
      user.twitter = await Twitter.findById(user.twitterId, (err) => {
        if (err) res.send(err);
      });
      user.alis = await Alis.findById(user.alisId, (err) => {
        if (err) res.send(err);
      });
      res.json(users);

    });
  });
};

// 特定のユーザーを取得する。
exports.showUserById = (req, res) => {
  User.findById(req.params.userId).lean().exec(async(err, user) => {
    if (err) res.send(err);
    user.twitter = await Twitter.findById(user.twitterId, (err) => {
      if (err) res.send(err);
    });
    user.alis = await Alis.findById(user.alisId, (err) => {
      if (err) res.send(err);
    });
    res.json(user);
  });
};

