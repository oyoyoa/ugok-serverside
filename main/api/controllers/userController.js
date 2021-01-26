const User = require("../models/userModel.js");
const Twitter = require("../models/twitterModel.js");
const ALIS = require("../models/alisModel.js");

// 全てのユーザーを取得する。
exports.showAllUsers = async(req, res) => {
  User.find().lean().exec(async(err, users) => {
    if (err) res.send("User: ", err);
    for(let i=0; i<users.length; i++){
      await Twitter.findById(users[i].twitterId, (err, twitter) => {
        if (err) res.send("Twitter: ", err);
        users[i].twitter = twitter;
      });
      await ALIS.findById(users[i].alisId, (err, alis) => {
        if (err) res.send("ALIS: ", err);
        users[i].alis = alis;
      });
      delete users[i].twitterId;
      delete users[i].alisId;
    }
    res.json(users);
  });
};

// 特定のユーザーを取得する。
exports.showUserById = async (req, res) => {
  User.findById(req.params.userId).lean().exec(async(err, user) => {
    if (err) res.send("User: ", err);
    await Twitter.findById(user.twitterId, (err, twitter) => {
      if (err) res.send("Twitter: ", err);
      user.twitter = twitter;
    });
    await ALIS.findById(user.alisId, (err, alis) => {
      if (err) res.send("ALIS: ", err);
      user.alis = alis;
    });
    delete user.twitterId;
    delete user.alisId;
    delete user.__v;
    delete user.twitter.__v;
    delete user.alis.__v;
    res.json(user);
  });
};

