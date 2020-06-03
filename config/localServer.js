const { DynamoDB } = require("aws-sdk");

const { createServer } = require("dynamodb-admin");

const dynamodb = new DynamoDB({ region: "ap-northeast-1" });

const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});
const app = createServer(dynamodb, dynClient);
const port = 8001;
const server = app.listen(port);
server.on("listening", () => {
  const address = server.address();
  console.log(`  listening on http://0.0.0.0:${address.port}`);
});
