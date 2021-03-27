"use strict";
const db = require("../../../config/db");
const Twitter = require("../../api/models/twitterModel");
const { readFileSync } = require("fs");

async function getUsersAndUpdate() {
  const users_obj = await Twitter.find(async (err, users) => {
    if (err) console.error(err);
    // update処理
    await Promise.all(
      users.map(async (user) => {
        const obj = getLikeAndRT(user.screenName);
        user.posts.all = obj.posts_all;
        user.likes.all = obj.likes_all;
        user.rt.all = obj.rt_all;
        await user.save((err, user) => {
          if (err) console.error(err);
          console.log(user);
        });
      })
    ).catch((error) => {
      console.error(error);
      //db.disconnectDB();
    });
  });
  return users_obj;
}

// 事前に取得しておいたjsonファイルから、ツイートを読み込んでいいねとRT数を計算する
function getLikeAndRT(user) {
  let rt = 0;
  let likes = 0;
  const tweets = JSON.parse(readFileSync(`json/tweets/${user}.json`, "utf-8"));
  tweets.forEach((tweet) => {
    likes += tweet.favorite_count;
    rt += tweet.retweet_count;
  });
  const twitter_obj = {
    posts_all: tweets.length,
    likes_all: likes,
    rt_all: rt,
  };
  return twitter_obj;
}

// todo: 全てのupdate処理が終わったあとdisconnectDBをする
async function main() {
  console.log("Get Tweets All");
  await getUsersAndUpdate();
}

module.exports.getTweetsAll = main;
db.connectDB();
main();

// todo: モジュール化する
