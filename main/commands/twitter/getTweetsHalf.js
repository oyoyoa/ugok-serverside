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

function getLikesAndRT(user, start, end) {
  let rt = 0;
  let likes = 0;
  const tweets = JSON.parse(
    readFileSync(`json/tweets/${user.twitter_id}.json`, "utf-8")
  );
  tweets.forEach((tweet) => {
    const created_at = new Date(tweet.created_at);
    if (
      start.getTime() < created_at.getTime() &&
      created_at.getTime() < end.getTime()
    ) {
      likes += tweet.favorite_count;
      rt += tweet.retweet_count;
    }
  });
  const twitter_obj = {
    likes_half: likes,
    rt_half: rt,
  };
  console.log(user.twitter_id, twitter_obj);
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
  console.log(date);
  const month = date.getMonth() + 1;
  console.log(month);
  let period;
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
  let users = getUsers();
  users.forEach((user) => {
    user.twitter = getLikesAndRT(user, start, end);
    updateTwitterData(user);
  });
}

main();
