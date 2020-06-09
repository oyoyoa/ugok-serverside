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

async function getTweets(user) {
  let params = {
    id: user.twitter_id,
    count: 200,
    include_rts: false,
  };
  let tweets = await twiClient.get("statuses/user_timeline", params);
  let all_tweets = tweets;
  let oldest = all_tweets.slice(-1)[0].id;
  while (tweets.length > 0) {
    params.maxid = oldest;
    tweets = await twiClient.get("statuses/user_timeline", params);
    all_tweets = all_tweets.concat(tweets);
    oldest = all_tweets.slice(-1)[0].id - 1;
  }
  fs.writeFileSync(
    `json/tweets/${user.twitter_id}.json`,
    JSON.stringify(all_tweets),
    "utf-8"
  );
}

async function main() {
  const users = await getUsers();
  Promise.all(
    users.map(async (user) => {
      getTweets(user);
    })
  )
    .then(() => {
      console.log("success");
    })
    .catch((error) => {
      console.error(error);
    });
  //   console.log(users);
}

main();
