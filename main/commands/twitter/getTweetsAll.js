"use strict";
const { readFileSync } = require("fs");
const { DynamoDB } = require("aws-sdk");
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});

// jsonfileから読み込む
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

function getLikeAndRT(user) {
  let rt = 0;
  let likes = 0;
  const tweets = JSON.parse(
    readFileSync(`json/tweets/${user.twitter_id}.json`, "utf-8")
  );
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

// DB操作
function updateTwitterData(user) {
  const params = {
    TableName: "Member",
    Key: {
      userId: user.id,
    },
    UpdateExpression: "SET #t.#la = :likesCount, #t.#ra = :rtCount",
    ExpressionAttributeNames: {
      "#t": "twitter",
      "#la": "likes_all",
      "#ra": "rt_all",
    },
    ExpressionAttributeValues: {
      ":likesCount": user.twitter.likes_all,
      ":rtCount": user.twitter.rt_all,
    },
  };
  try {
    dynClient.update(params).promise();
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  let users = getUsers();
  users.forEach((user) => {
    user.twitter = getLikeAndRT(user);
    updateTwitterData(user);
  });
}

main();
