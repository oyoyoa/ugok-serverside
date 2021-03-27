"use strict";
const db = require("../../../config/db");
const Twitter = require("../../api/models/twitterModel");
const { readFileSync } = require("fs");

async function getUsersAndUpdate(start, end) {
  const users_obj = await Twitter.find(async (err, users) => {
    if (err) console.error(err);
    // ここにupdate処理が必要
    await Promise.all(
      users.map(async (user) => {
        const obj = getLikesAndRT(user.screenName, start, end);
        user.posts.half = obj.posts_half;
        user.likes.half = obj.likes_half;
        user.rt.half = obj.rt_half;
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

function getLikesAndRT(user, start, end) {
  let rt = 0;
  let likes = 0;
  let posts = 0;
  const tweets = JSON.parse(readFileSync(`json/tweets/${user}.json`, "utf-8"));
  tweets.forEach((tweet) => {
    const created_at = new Date(tweet.created_at);
    if (
      start.getTime() < created_at.getTime() &&
      created_at.getTime() < end.getTime()
    ) {
      posts++ ;
      likes += tweet.favorite_count;
      rt += tweet.retweet_count;
    }
  });
  const twitter_obj = {
    posts_half: posts,
    likes_half: likes,
    rt_half: rt,
  };
  return twitter_obj;
}

async function main() {
  console.log("Get Tweets Half");

  const date = new Date();
  const month = date.getMonth() + 1;
  console.log("this month:", month, "(Twitter Half)");
  let period;
  //triggerにする
  if (month !== 4 && month !== 9) {
    console.log("学期始めではありません");
    return;
  }
  if (month === 4) {
    period = 7;
  } else if (month === 9) {
    period = 5;
  }
  const year_e = date.getFullYear();
  const month_e = date.getMonth() - 2;
  date.setMonth(date.getMonth() - period);
  const year_s = date.getFullYear();
  const month_s = date.getMonth() - 2;
  const start = new Date(year_s, month_s);
  const end = new Date(year_e, month_e);
  start.setDate(2);
  end.setDate(2);

  getUsersAndUpdate(start, end);
}

module.exports.getTweetsHalf = main;
db.connectDB();
main();
// todo: モジュール化する
