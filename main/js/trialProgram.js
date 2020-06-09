"use strict";
import fetch from "node-fetch";

const users = [
  "ugok841",
  "chiroru",
  "yoch",
  "4ro",
  "Onasu",
  "tsumri",
  "hi-ko",
  "nnin",
  "0721",
  "kero-ugok",
  "ringo",
  "77ugok",
];
async function getArticlesId(user) {
  const url = `https://alis.to/api/users/${user}/articles/public`;
  const response = await fetch(
    `https://alis.to/api/users/${user}/articles/public`
  );
  const body = await response.json();
  let alis = {
    id: user,
    articles: [],
  };
  body.Items.forEach((article) => {
    alis.articles.push(article.article_id);
  });
  return alis;
}

async function getAlisLikes(alis) {
  let articles = {
    id: alis.id,
    likes: 0,
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
        articles.likes += obj.count;
      });
    })
    .catch((err) => {
      console.log("getAlisLikes");
      console.log(err);
    });
  return articles;
}

async function main() {
  await Promise.all(
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
