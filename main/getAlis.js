const fetch = require("node-fetch");
const { DynamoDB } = require("aws-sdk");
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});

function getUserName() {
  let users = [];
  const params = {
    TableName: "Member",
  };
  return new Promise((resolve) => {
    dynClient.scan(params, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        data.Items.forEach((user) => {
          users.push({ id: user.userId, name: user.name });
        });
        resolve(users);
      }
    });
  });
}

function getAlisUser(user) {
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
  const users = await getUserName();
  Promise.all(
    users.map(async (user) => {
      getAlisUser(user);
    })
  );
}

main();
