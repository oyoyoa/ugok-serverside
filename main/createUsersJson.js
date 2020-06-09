"use strict";
const { writeFileSync } = require("fs");
const { DynamoDB } = require("aws-sdk");
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});

async function main() {
  let users = [];
  const params = {
    TableName: "Member",
  };
  await dynClient
    .scan(params, (error, data) => {
      if (error) console.error(error);
      else {
        data.Items.forEach((user) => {
          users.push({
            user_id: user.userId,
            name: user.name,
            twitter_id: user.twitter.screenName,
            alis_id: user.alis.id,
          });
        });
      }
    })
    .promise();
  writeFileSync(`json/ugokMembers.json`, JSON.stringify(users), "utf-8");
}

main();
