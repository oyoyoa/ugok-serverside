const twitter = require("twitter");
const fs = require("fs");
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ region: "ap-northeast-1" });
const dynClient = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});
const twiClient = new twitter(
  JSON.parse(fs.readFileSync("secret.json", "utf-8"))
);

twiClient.get("lists/list", (error, lists) => {
  if (!error) {
    const params = {
      TableName: "List",
      Item: {
        listId: 1,
        twitterId: lists[0].id_str,
        name: lists[0].name,
      },
    };
    dynClient.put(params).promise();
  } else {
    console.log(error);
  }
});
