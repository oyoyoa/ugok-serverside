"use strict";
const { readFileSync } = require("fs");
const fetch = require("node-fetch");
const { DynamoDB } = require("aws-sdk");
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});

function getUsers() {
  const users_obj = JSON.parse(readFileSync("json/ugokMembers.json", "utf-8"));
  let users = [];
  users_obj.forEach((user) => {
    users.push({
      id: user.user_id,
      name: user.name,
    });
  });

  return users;
}

// DB操作
async function getAlisUser(user) {
  const request = await fetch(
    encodeURI(`https://alis.to/api/search/users?query=${user.name}`)
  );
  const body = await request.json();
  if (body.length === 0) {
    console.log(`${user.name}のデータがありません`);
  } else {
    const params = {
      TableName: "Member",
      Key: {
        userId: user.id,
      },
      UpdateExpression: "SET #a.#i = :newId",
      ExpressionAttributeNames: {
        "#a": "alis",
        "#i": "id",
      },
      ExpressionAttributeValues: {
        ":newId": body[0].user_id,
      },
    };
    try {
      dynClient.update(params).promise();
      console.log(`success!${user.id},${user.name}`);
    } catch (error) {
      console.log(error);
    }
  }
}

async function main() {
  const users = getUsers();
  Promise.all(
    users.map(async (user) => {
      getAlisUser(user);
    })
  ).catch((error) => {
    console.error(error);
  });
}

main();
