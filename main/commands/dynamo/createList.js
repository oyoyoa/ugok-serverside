"use strict";
require("dotenv").config();
const { readFileSync } = require("fs");
const twitterAPI = require("twitter"),
  consumer_key = process.env.CONSUMER_KEY,
  consumer_secret = process.env.CONSUMER_SECRET,
  access_token_key = process.env.ACCESS_TOKEN_KEY,
  access_token_secret = process.env.ACCESS_TOKEN_SECRET;
  
const twiClient = new twitterAPI({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token_key: access_token_key,
  access_token_secret: access_token_secret,
});

twiClient.get("lists/list", (error, lists) => {
  if (error) console.error(error);
  else {
    const params = {
      TableName: "UGOKList",
      Item: {
        id: 1,
        name: lists[0].name,
        twitterId: lists[0].id_str,
      },
    };
    dynClient.put(params, (error) => {
      if (error) console.log(error);
    });
  }
});
