const fs = require("fs");
const request = require("request");
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ region: "ap-northeast-1" });
const dynClient = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});

function getAlisUser() {
  getUserName().then((userName) => {
    userName.forEach((user) => {
      const options = {
        url: encodeURI(`https://alis.to/api/search/users?query=${user.name}`),
        method: "GET",
        json: true,
      };
      request(options, (error, responce, body) => {
        if (!error && body.length > 0) {
          const params = {
            TableName: "Member",
            Item: {
              userId: user.id,
              alis: {
                id: user.id,
              },
            },
          };
          try {
            dynClient.put(params);
          } catch (error) {
            console.log(error);
          }
        } else if (body.length === 0) {
          console.log(user.name);
          console.log("データがありません");
        } else {
          console.log(error);
        }
      });
    });
  });
}

function addAlisItem() {}
function getUserName() {
  let userName = [];
  const params = {
    TableName: "Member",
  };
  return new Promise((resolve) => {
    dynClient.scan(params, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        data.Items.forEach((user) => {
          userName.push({ id: user.userId, name: user.name });
        });
        resolve(userName);
      }
    });
  });
}
getAlisUser();
