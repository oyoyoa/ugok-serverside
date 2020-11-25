const User = require("../models/userModel.js");

// 全てのユーザーを取得する。
exports.showAllUsers = (req, res) => {
  User.find({}, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
};

// 特定のユーザーを取得する。
exports.showUserById = (req, res) => {
  User.findById(req.params.userId, function(err, task) {
    if (err) res.send(err);
    res.json(task);
  });
};

