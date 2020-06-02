const fetch = require("node-fetch");

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ region: "ap-northeast-1" });
const dynClient = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});

async function getUserId() {
  let users = [];
  const params = {
    TableName: "Member",
  };
  await dynClient
    .scan(params, (error, data) => {
      if (error) console.error(error);
      else {
        data.Items.forEach((user) => {
          users.push({ user_id: user.userId, alis_id: user.alis.id });
        });
      }
    })
    .promise();
  return users;
}

async function getArticlesId(user) {
  const response = await fetch(
    `https://alis.to/api/users/${user.alis_id}/articles/public`
  );
  const body = await response.json();
  let alis = {
    id: user.user_id,
    articles: [],
  };
  if ("Items" in body) {
    body.Items.forEach((article) => {
      alis.articles.push(article.article_id);
    });
  }
  return alis;
}

async function getAlisLikes(alis) {
  let likes = {
    id: alis.id,
    count: 0,
  };
  await Promise.all(
    alis.articles.map(async (article) => {
      const response = await fetch(
        `https://alis.to/api/articles/${article}/likes`
      );
      return await response.json();
    })
  )
    .then((body) => {
      body.forEach((obj) => {
        likes.count += obj.count;
      });
    })
    .catch((err) => {
      console.log("getAlisLikes");
      console.log(err);
    });
  return likes;
}

async function main() {
  const users = await getUserId();
  Promise.all(
    users.map(async (user) => {
      const alis = await getArticlesId(user);
      return await getAlisLikes(alis);
    })
  )
    .then((data) => {
      console.log("success");
      console.log(data);
    })
    .catch((err) => {
      console.log("main");
      console.log(err);
    });
}
main();
