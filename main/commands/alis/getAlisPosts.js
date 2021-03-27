"use strict";
const fetch = require("node-fetch");
const db = require("../../../config/db");
const Alis = require("../../api/models/alisModel");

async function getUsersAndUpdate() {
  const users_obj = await Alis.find(async (err, users) => {
    if (err) console.error(err);
    // update処理
    await Promise.all(
      users.map(async (user) => {
        const alis = await getArticlesId(user.alisId);
        const data = await getAlisData(alis);
        user.likes.all = data.likes;
        user.posts.all = data.posts;
        await user.save((err, user) => {
          if (err) console.error(err);
          console.log(user);
        });
      })
    ).catch((error) => {
      console.error(error);
      // db.disconnectDB();
    });
  });
  return users_obj;
}

// 全期間の記事のidを取得する
async function getArticlesId(user) {
  const response = await fetch(
    `https://alis.to/api/users/${user}/articles/public`
  );
  const body = await response.json();
  let articles = [];
  if ("Items" in body) {
    body.Items.forEach((article) => {
      articles.push(article.article_id);
    });
  }
  return articles;
}

// 全期間の記事のidを元に、いいねの数を計算する
async function getAlisData(articles) {
  let alis = {
    likes: 0,
    posts: articles.length,
  };
  await Promise.all(
    articles.map(async (article) => {
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
    .catch((err) => {
      console.log("getAlisLikes");
      console.log(err);
    });
  return alis;
}

// todo: update処理が全て終わった後にdisconnectDBをする
async function main() {
  console.log("Get Alis Posts All");

  await getUsersAndUpdate();
}
module.exports.getAlisAll = main;
db.connectDB();
main();
// todo: モジュール化する
