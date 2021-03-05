"use strict";
const fetch = require("node-fetch");
const db = require("../../../config/db");
const Alis = require("../../api/models/alisModel");

async function getUsersAndUpdate(date) {
  const users_obj = await Alis.find(async (err, users) => {
    if (err) console.error(err);
    // ここにupdate処理が必要;
    await Promise.all(
      users.map(async (user) => {
        const articles = await getArticlesId(user.alisId, date);
        const data = await getAlisData(articles);
        user.likes.week = data.likes;
        user.posts.week = data.posts;
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

async function getArticlesId(user, date) {
  const response = await fetch(
    `https://alis.to/api/users/${user}/articles/public`
  );
  const body = await response.json();
  let articles = [];
  if ("Items" in body) {
    body.Items.forEach((article) => {
      if (date.getTime() < article.created_at * 1000) {
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

async function main() {
  const date = new Date();
  date.setDate(date.getDate() - 7);

  getUsersAndUpdate(date);
}

module.exports.getAlisWeek =  main;
main();
// todo: モジュール化する
