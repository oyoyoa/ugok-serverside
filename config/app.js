import twitter from "twitter";
import { readFileSync } from "fs";
import { DynamoDB } from "aws-sdk";
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});
const twiClient = new twitter(JSON.parse(readFileSync("secret.json", "utf-8")));
