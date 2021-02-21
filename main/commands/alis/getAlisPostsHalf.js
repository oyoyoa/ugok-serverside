"use strict";
const fetch = require("node-fetch");
const db = require("../../../config/db");
const Alis = require("../../api/models/alisModel");

async function getUsersAndUpdate(start, end) {
  const users_obj = await Alis.find(async (err, users) => {
    if (err) console.error(err);
    // ここにupdate処理が必要;
    await Promise.all(
      users.map(async (user) => {
        const articles = await getArticlesId(user.alisId, start, end);
        const data = await getAlisData(articles);
        user.likes.half = data.likes;
        user.posts.half = data.posts;
        await user.save((err, user) => {
          if (err) console.error(err);
          console.log(user);
        });
      })
    ).catch((error) => {
      console.error(error);
      db.disconnectDB();
    });
  });
  return users_obj;
}

async function getArticlesId(user, start, end) {
  const response = await fetch(
    `https://alis.to/api/users/${user}/articles/public`
  );
  const body = await response.json();
  let articles = [];
  if ("Items" in body) {
    body.Items.forEach((article) => {
      if (
        start.getTime() < article.created_at * 1000 &&
        article.created_at * 1000 < end.getTime()
      ) {
        articles.push(article.article_id);
      }
    });
  }
  return articles;
}

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
    .catch((error) => {
      console.error(error);
    });
  return alis;
}

module.exports.getAlisHalf = async function main() {
  const date = new Date();
  const month = date.getMonth() + 1;
  let period;
  //triggerにする
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

  getUsersAndUpdate(start, end);
}

// main();
// todo: モジュール化する
