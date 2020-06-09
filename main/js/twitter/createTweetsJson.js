"use strict";
const twitter = require("twitter");
const fs = require("fs");
const twiClient = new twitter(
  JSON.parse(fs.readFileSync("config/secret.json", "utf-8"))
);

function getUsers() {
  const users_obj = JSON.parse(
    fs.readFileSync("json/ugokMembers.json", "utf-8")
  );
  let users = [];
  users_obj.forEach((user) => {
    users.push({
      id: user.user_id,
      twitter_id: user.twitter_id,
    });
  });

  return users;
}

async function getTweets(user) {
  console.log(user);
  let params = {
    id: user.twitter_id,
    count: 200,
    include_rts: false,
  };
  let tweets = await twiClient
    .get("statuses/user_timeline", params)
    .catch((error) => console.error(error));
  let all_tweets = tweets;
  let oldest = all_tweets.slice(-1)[0].id;
  while (tweets.length > 0) {
    console.log(`${oldest}より古いツイートです`);
    params.max_id = oldest;
    tweets = await twiClient
      .get("statuses/user_timeline", params)
      .catch((error) => console.error(error));
    all_tweets = all_tweets.concat(tweets);
    oldest = all_tweets.slice(-1)[0].id - 300;
  }
  fs.writeFileSync(
    `json/tweets/${user.twitter_id}.json`,
    JSON.stringify(all_tweets),
    "utf-8"
  );
}

async function main() {
  const users = getUsers();
  Promise.all(
    users.map(async (user) => {
      getTweets(user);
    })
  )
    .then(() => {
      console.log("success");
    })
    .catch((error) => {
      console.error(error);
    });
  console.log(users);
}

main();
