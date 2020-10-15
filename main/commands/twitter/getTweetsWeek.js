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

function getLikesAndRT(user, date) {
  let rt = 0;
  let likes = 0;
  const tweets = JSON.parse(
    readFileSync(`json/tweets/${user.twitter_id}.json`, "utf-8")
  );
  tweets.forEach((tweet) => {
    const created_at = new Date(tweet.created_at);
    if (date.getTime() < created_at.getTime()) {
      // console.log("1週間以内のツイートです");
      // console.log("tweet: ", tweet.text);
      // console.log("newDate: ", date.getTime(), date);
      // console.log("created_at: ", created_at.getTime(), created_at);
      likes += tweet.favorite_count;
      rt += tweet.retweet_count;
    }
  });
  const twitter_obj = {
    likes_week: likes,
    rt_week: rt,
  };
  console.log(user.twitter_id, twitter_obj);
  return twitter_obj;
}

// DB操作
function updateTwitterData(user) {
  const params = {
    TableName: "Member",
    Key: {
      userId: user.id,
    },
    UpdateExpression: "SET #t.#lw = :likesCount, #t.#rw = :rtCount",
    ExpressionAttributeNames: {
      "#t": "twitter",
      "#lw": "likes_week",
      "#rw": "rt_week",
    },
    ExpressionAttributeValues: {
      ":likesCount": user.twitter.likes_week,
      ":rtCount": user.twitter.rt_week,
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
  date.setDate(date.getDate() - 7);
  console.log(date);
  let users = getUsers();
  users.forEach((user) => {
    user.twitter = getLikesAndRT(user, date);
    updateTwitterData(user);
  });
}
main();
