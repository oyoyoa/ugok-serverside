"use strict";
const { readFileSync } = require("fs");
const { DynamoDB } = require("aws-sdk");
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});

function getUsers() {
  const users_obj = JSON.parse(readFileSync("json/ugokMembers.json", "utf-8"));
  let users = [];
  users_obj.forEach((user) => {
    users.push({
      id: user.user_id,
      twitter_id: user.twitter_id,
    });
  });

  return users;
}

function getLikeAndRT(user, date) {
  let rt = 0;
  let likes = 0;
  const tweets = JSON.parse(
    readFileSync(`json/tweets/${user.twitter_id}.json`, "utf-8")
  );
  if (user.twitter_id === "kero_ugok") console.log(tweets.slice(-1)[0]);
  tweets.forEach((tweet) => {
    if (Date.parse(tweet.created_at) > date.getTime()) {
      likes += tweet.favorite_count;
      rt += tweet.retweet_count;
    }
  });
  const twitter_obj = {
    likes_half: likes,
    rt_half: rt,
  };
  return twitter_obj;
}

function updateTwitterData(user) {
  const params = {
    TableName: "Member",
    Key: {
      userId: user.id,
    },
    UpdateExpression: "SET #t.#lh = :likesCount, #t.#rh = :rtCount",
    ExpressionAttributeNames: {
      "#t": "twitter",
      "#lh": "likes_half",
      "#rh": "rt_half",
    },
    ExpressionAttributeValues: {
      ":likesCount": user.twitter.likes_half,
      ":rtCount": user.twitter.rt_half,
    },
  };
  try {
    dynClient.update(params).promise();
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  const date = new Date();
  const month = date.getMonth() + 1;
  let period;
  if (month !== 4 && month !== 6) {
    console.log("学期始めではありません");
    return;
  }
  if (month === 4) {
    period = 18408600000;
  } else if (month === 6) {
    period = 15778800000;
  }
  date.setTime(date.getTime() - period);
  console.log(date);
  let users = getUsers();
  console.log(users);
  users.forEach((user) => {
    user.twitter = getLikeAndRT(user, date);
    // updateTwitterData(user);
  });
}

main();