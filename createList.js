const twitter = require("twitter");
const fs = require("fs");
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ region: "ap-northeast-1" });
const dynClient = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});
const client = new twitter(JSON.parse(fs.readFileSync("secret.json", "utf-8")));

client.get("lists/list", (error, lists) => {
  if (!error) {
    const params = {
      TableName: "List",
      Item: {
        id: lists[0].id_str,
        name: lists[0].name,
      },
    };
    dynClient.put(params).promise();
  } else {
    console.log(error);
  }
});
