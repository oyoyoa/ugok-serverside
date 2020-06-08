const twitter = require("twitter");
const fs = require("fs");
const { DynamoDB } = require("aws-sdk");
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});
const twiClient = new twitter(
  JSON.parse(fs.readFileSync("config/secret.json", "utf-8"))
);

async function getUsers() {
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
            twitter_id: user.twitter.screenName,
          });
        });
      }
    })
    .promise();
  return users;
}

async function getTweets(users) {
  await Promise.all(
    users.map(async (user) => {
      const params = {
        id: user.twitter_id,
        count: 200,
        include_rts: false,
      };
      console.log("次");
      const tweets = await twiClient.get("statuses/user_timeline", params);
      fs.writeFileSync(
        `json/tweets/${user.twitter_id}.json`,
        JSON.stringify(tweets),
        "utf-8"
      );
    })
  );
}

async function main() {
  const users = await getUsers();
  getTweets(users);
  //   console.log(users);
}

main();
