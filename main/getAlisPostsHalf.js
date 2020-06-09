const fetch = require("node-fetch");
const { DynamoDB } = require("aws-sdk");
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
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

async function getArticlesId(user, date) {
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
      if (article.created_at * 1000 > date.getTime()) {
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

function updateAlisData(user) {
  console.log(user.likes, user.posts);
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
    period = 18408600000;
  } else if (month === 9) {
    period = 15778800000;
  }
  date.setTime(date.getTime() - period);
  const users = await getUserId();
  Promise.all(
    users.map(async (user) => {
      const alis = await getArticlesId(user, date);
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
