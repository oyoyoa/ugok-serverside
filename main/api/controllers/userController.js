const mongoose = require("mongoose"),
  User = mongoose.model("User");

// 全てのユーザーを取得する。
exports.all_users = (req, res) => {
  User.find({}, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
};

// 新しいユーザーを作成する。
exports.create_user = (req, res) => {
  const new_user = new user(req.body);
  new_user.save((err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
};

// 特定のユーザーを取得する。
exports.load_user = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
};

// 特定のユーザーを更新する。
exports.update_user = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    req.body,
    { new: true },
    (err, user) => {
      if (err) res.send(err);
      res.json(user);
    }
  );
};

// 特定のユーザーを削除する。
exports.delete_user = (req, res) => {
  User.remove(
    {
      _id: req.params.userId,
    },
    (err, user) => {
      if (err) res.send(err);
      res.json({ message: "user successfully deleted" });
    }
  );
};
