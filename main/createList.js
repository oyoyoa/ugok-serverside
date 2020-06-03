import twitter from "twitter";
import { readFileSync } from "fs";
import { DynamoDB } from "aws-sdk";
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});
const twiClient = new twitter(
  JSON.parse(readFileSync("config/secret.json", "utf-8"))
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
