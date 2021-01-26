"use strict";
require("dotenv").config();
const db = require("../../../config/db");
const Twitter = require("../../api/models/twitterModel");
const fs = require("fs");
const twitterAPI = require("twitter");
const twiClient = new twitterAPI({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

async function getUsers() {
  const users_obj = await Twitter.find((err) => {
    if (err) console.error(err);
  });
  return users_obj;
}

async function getTweets(userId) {
  let params = {
    id: userId,
    count: 200,
    include_rts: false,
  };
  let tweets = await twiClient
    .get("statuses/user_timeline", params)
    .catch((error) => console.error(error));
  let all_tweets = tweets;
  let oldest = all_tweets.slice(-1)[0].id;
  while (tweets.length > 0) {
    // console.log(`${oldest}より古いツイートです`);
    params.max_id = oldest;
    tweets = await twiClient
      .get("statuses/user_timeline", params)
      .catch((error) => console.error(error));
    all_tweets = all_tweets.concat(tweets);
    oldest = all_tweets.slice(-1)[0].id - 300;
  }
  fs.writeFileSync(
    `json/tweets/${userId}.json`,
    JSON.stringify(all_tweets),
    "utf-8"
  );
}

async function main() {
  db.connectDB();
  const users = await getUsers();
  // db.disconnectDB();
  Promise.all(
    users.map(async (user) => {
      getTweets(user.screenName);
    })
  )
    .then(() => {
      console.log("success");
    })
    .catch((error) => {
      console.error(error);
    });
}

main();
// todo: モジュール化する
