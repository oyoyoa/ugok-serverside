"use strict";
const db = require("../../../config/db");
const Twitter = require("../../api/models/twitterModel");
const { readFileSync } = require("fs");

async function getUsersAndUpdate(date) {
  const users_obj = await Twitter.find(async (err, users) => {
    if (err) console.error(err);
    // ここにupdate処理が必要
    await Promise.all(
      users.map(async (user) => {
        const obj = getLikesAndRT(user.screenName, date);
        user.likes.week = obj.likes_week;
        user.rt.week = obj.rt_week;
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

function getLikesAndRT(user, date) {
  let rt = 0;
  let likes = 0;
  const tweets = JSON.parse(readFileSync(`json/tweets/${user}.json`, "utf-8"));
  tweets.forEach((tweet) => {
    const created_at = new Date(tweet.created_at);
    if (date.getTime() < created_at.getTime()) {
      likes += tweet.favorite_count;
      rt += tweet.retweet_count;
    }
  });
  const twitter_obj = {
    likes_week: likes,
    rt_week: rt,
  };
  return twitter_obj;
}

module.exports.getTweetsWeek = async function main() {
  const date = new Date();
  date.setDate(date.getDate() - 7);

  getUsersAndUpdate(date);
}
// main();
// todo: モジュール化する
