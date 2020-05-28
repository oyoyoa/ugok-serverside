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
  if (error) {
    console.log(error);
  } else {
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
