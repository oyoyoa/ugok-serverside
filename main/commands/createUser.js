"use strict";
require("dotenv").config();
const db = require("../../config/db");

const User = require("../api/models/userModel"),
  Twitter = require("../api/models/twitterModel");

const twitterAPI = require("twitter"),
  consumer_key = process.env.CONSUMER_KEY,
  consumer_secret = process.env.CONSUMER_SECRET,
  access_token_key = process.env.ACCESS_TOKEN_KEY,
  access_token_secret = process.env.ACCESS_TOKEN_SECRET;

async function getUserByTwitter() {
  const twiClient = new twitterAPI({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token_key: access_token_key,
    access_token_secret: access_token_secret,
  });
  const params = {
    list_id: "1044751513468293126", // UGOKリストのID
    count: 50,
  };
  // UGOKまとめリストから、メンバーを取得するTwitter APIを叩く
  twiClient.get("lists/members", params, async (error, members) => {
    // twitter APIを呼び出せたかチェック
    if (error) {
      console.error(error);
    } else {
      await Promise.all(
        members.users.map(async (member) => {
          // メンバーが取得できた場合、Modelを作成する
          if (member !== undefined) {
            createMember(
              member.name,
              member.id_str,
              member.screen_name,
              member.profile_image_url
            );
          } else {
            console.log(`undefined twitter user`);
          }
        })
      );
    }
  });
}

async function createMember(name, id, screen_name, icon_url) {
  //   すでにユーザーがいるかどうかチェック
  const twi_user = await Twitter.findOne({ twitterId: id });
  if (twi_user === null) {
    try {
      const twitter = new Twitter({
        twitterId: id,
        screenName: screen_name,
        icon: icon_url,
      });
      await twitter.save((err) => {
        if (err) throw err;
      });
      console.log(`create twitter (${twitter.screenName}) !`);
      const user = new User({
        name: name,
        twitterId: twitter._id,
      });
      await user.save((err) => {
        if (err) throw err;
      });
      console.log(`create user (${user.name}) !`);
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log(`${name} is already exists.`);
  }
}

db.connectDB();
getUserByTwitter();
