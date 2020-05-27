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

function getListItem() {
  const params = {
    TableName: "List",
    KeyConditionExpression: "#key1 = :key1_name",
    ExpressionAttributeNames: {
      "#key1": "listId",
    },
    ExpressionAttributeValues: {
      ":key1_name": 1,
    },
  };
  return new Promise((resolve) => {
    dynClient.query(params, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        resolve(data.Items[0].twitterId);
      }
    });
  });
}

function createMemberAll() {
  getListItem().then((id_str) => {
    const params = {
      list_id: id_str,
      count: 50,
      cursor: -1,
    };
    twiClient.get("lists/members", params, (error, members) => {
      if (error) {
        console.error(error);
      } else {
        members.users.forEach((member, index) => {
          if (member != undefined) {
            let item = {
              id: member.id_str,
              name: member.name,
              icon: member.profile_image_url,
            };
            createMember(item, index);
          }
        });
      }
    });
  });
}

function createMember(item, index) {
  const params = {
    TableName: "Member",
    Item: {
      userId: index + 1,
      twitter: item,
    },
  };
  try {
    dynClient.put(params).promise();
  } catch (error) {
    return error;
  }
}

createMemberAll();
