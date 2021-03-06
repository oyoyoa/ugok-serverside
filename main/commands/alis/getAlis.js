"use strict";
const fetch = require("node-fetch");
const db = require("../../../config/db");
const User = require("../../api/models/userModel"),
  Alis = require("../../api/models/alisModel");

async function createAlis() {
  const users_obj = await User.find(async (err, users) => {
    if (err) console.error(err);
    // ここにupdate処理が必要
    await Promise.all(
      users.map(async (user) => {
        const body = await getAlisUser(user.name);
        if (body.length === 0) {
          console.log(`${user.name}のデータがありません`);
        } else {
          const alis = new Alis({ alisId: body[0].user_id });
          user.alisId = alis._id;
          await alis.save((err) => {
            if (err) console.error(err);
          });
          await user.save((err, user) => {
            if (err) console.error(err);
            console.log(user);
          });
        }
      })
    ).catch((error) => {
      console.error(error);
      // db.disconnectDB();
    });
  });
  return users_obj;
}

async function getAlisUser(name) {
  const request = await fetch(
    encodeURI(`https://alis.to/api/search/users?query=${name}`)
  );
  const body = await request.json();
  return body;
}

async function main() {
  db.connectDB();
  await createAlis();
  // Promise.all(
  //   users.map(async (user) => {
  //     getAlisUser(user);
  //   })
  // ).catch((error) => {
  //   console.error(error);
  // });
}

// main();
// todo: モジュール化する
// disconnectDB
