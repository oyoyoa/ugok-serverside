"use strict";
const { readFileSync } = require("fs");
const fetch = require("node-fetch");
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
      alis_id: user.alis_id,
    });
  });

  return users;
}

async function getArticlesId(user, start, end) {
  const response = await fetch(
    `https://alis.to/api/users/${user.alis_id}/articles/public`
  );
  const body = await response.json();
  let alis = {
    id: user.id,
    articles: [],
  };
  if ("Items" in body) {
    body.Items.forEach((article) => {
      if (
        start.getTime() < article.created_at * 1000 &&
        created_at * 1000 < end.getTime()
      ) {
        alis.articles.push(article.article_id);
      }
    });
  }
  return alis;
}

async function getAlisLikes(alis_data) {
  let alis = {
    id: alis_data.id,
    likes: 0,
    posts: alis_data.articles.length,
  };
  await Promise.all(
    alis_data.articles.map(async (article) => {
      const response = await fetch(
        `https://alis.to/api/articles/${article}/likes`
      );
      return await response.json();
    })
  )
    .then((body) => {
      body.forEach((obj) => {
        alis.likes += obj.count;
      });
    })
    .catch((error) => {
      console.error(error);
    });
  return alis;
}

// DB操作
function updateAlisData(user) {
  const params = {
    TableName: "Member",
    Key: {
      userId: user.id,
    },
    UpdateExpression: "SET #a.#l = :likesCount, #a.#p = :postsCount",
    ExpressionAttributeNames: {
      "#a": "alis",
      "#l": "likes_half",
      "#p": "posts_half",
    },
    ExpressionAttributeValues: {
      ":likesCount": user.likes,
      ":postsCount": user.posts,
    },
  };
  try {
    dynClient.update(params).promise();
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  const date = new Date();
  const month = date.getMonth() + 1;
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
  const users = getUsers();
  Promise.all(
    users.map(async (user) => {
      const alis = await getArticlesId(user, start, end);
      return await getAlisLikes(alis);
    })
  )
    .then((users) => {
      users.forEach((user) => {
        updateAlisData(user);
      });
      console.log("success");
    })
    .catch((error) => {
      console.error(error);
    });
}

main();
