"use strict";
const db = require("../../../config/db");
const Twitter = require("../../api/models/twitterModel");
const { readFileSync } = require("fs");

// jsonfileから読み込む
async function getUsersAndUpdate() {
  const users_obj = await Twitter.find(async (err, users) => {
    if (err) console.error(err);
    // ここにupdate処理が必要
    await Promise.all(
      users.map(async (user) => {
        const obj = getLikeAndRT(user.screenName);
        user.likes.all = obj.likes_all;
        user.rt.all = obj.rt_all;
        await user.save((err, user) => {
          if (err) console.error(err);
          console.log(user);
        });
      })
    ).catch((error) => {
      console.error(error);
      db.disconnectDB();
    });
  });
  return users_obj;
}

function getLikeAndRT(user) {
  let rt = 0;
  let likes = 0;
  const tweets = JSON.parse(readFileSync(`json/tweets/${user}.json`, "utf-8"));
  tweets.forEach((tweet) => {
    likes += tweet.favorite_count;
    rt += tweet.retweet_count;
  });
  const twitter_obj = {
    likes_all: likes,
    rt_all: rt,
  };
  return twitter_obj;
}

async function main() {
  db.connectDB();
  await getUsersAndUpdate();
}

main();
// disconnectDBをしたい
// todo: モジュール化する
