const request = require("request");
const https = require("https");
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
  const url = `https://alis.to/api/users/${user.alis_id}/articles/public`;
  return new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
      res.on("data", (chunk) => {
        const body = JSON.parse(chunk.toString() || "null");
        // 全員が名前をツイッターと一致したら条件式消す
        if ("Items" in body) {
          let alis = {
            id: user.user_id,
            articles: [],
          };
          body.Items.forEach((article) => {
            alis.articles.push(article.article_id);
          });
          resolve(alis);
          //   getAlisLikes(alis);
        }
      });
      res.on("error", (error) => {
        reject("error");
        console.error(error);
      });
    });
    req.end();
  });
}

function getAlisLikes(user) {
  let likes = 0;
  user.articles.forEach((article) => {
    const options = {
      url: `https://alis.to/api/articles/${article}/likes`,
      method: "GET",
      json: true,
    };
    request(options, (error, responce, body) => {
      if (error) console.log(error);
      else {
        likes += body.count;
      }
    });
  });
  console.log(user.id, likes);
}

async function main() {
  let articles = [];
  // getUserId()の処理が終わったあと
  const users = await getUserId();
  //   const articles = await getArticlesId(users[0]);
  //   let articles = [];
  await Promise.all(
    users.map(async (user) => {
      //   console.log(await getArticlesId(user));
      return await getArticlesId(user);
    })
  )
    .then(() => {
      console.log("success");
    })
    .catch((err) => {
      console.log(err);
    });

  //    users.forEach((user) => {
  //     const article = await getArticlesId(user);
  //     articles.push(article);
  //   });

  // userの回数繰り返す
  // resolve(articles_obj);
}
function putAlisItems() {}
main();
console.log(getArticlesId({ user_id: 1, alis_id: "ugok841" }));
getArticlesId({ user_id: 1, alis_id: "ugok841" }).then((data) =>
  console.log(data)
);
