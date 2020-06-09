const { readFileSync } = require("fs");
const { DynamoDB } = require("aws-sdk");
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});

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

function getLikeAndRT(user) {
  let rt = 0;
  let likes = 0;
  const tweets = JSON.parse(
    readFileSync(`json/tweets/${user.twitter_id}.json`, "utf-8")
  );
  tweets.forEach((tweet) => {
    likes += tweet.favorite_count;
    rt += tweet.retweet_count;
  });
  const twitter_obj = {
    likes_all: likes,
    rt_all: rt,
  };
  return twitter_obj;
}

function updateTwitterData(user) {
  const params = {
    TableName: "Member",
    Key: {
      userId: user.user_id,
    },
    UpdateExpression: "SET #t.#la = :likesCount, #t.#ra = :rtCount",
    ExpressionAttributeNames: {
      "#t": "twitter",
      "#la": "likes_all",
      "#ra": "rt_all",
    },
    ExpressionAttributeValues: {
      ":likesCount": user.twitter.likes_all,
      ":rtCount": user.twitter.rt_all,
    },
  };
  try {
    dynClient.update(params).promise();
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  let users = await getUsers();
  users.forEach((user) => {
    user.twitter = getLikeAndRT(user);
    updateTwitterData(user);
  });
}

main();
