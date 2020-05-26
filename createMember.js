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

function createAllMember() {
  const list_obj = JSON.parse(fs.readFileSync("json/lists.json", "utf-8"));
  const list_id = list_obj[0].id_str;
  const params = {
    list_id: list_id,
    count: 50,
    cursor: -1,
  };

  twiClient.get("lists/members", params, (error, members) => {
    if (!error) {
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
    } else {
      console.error(error);
    }
  });
}

function createMember(item, index) {
  const params = {
    TableName: "Member",
    Item: {
      userId: index,
      twitter: item,
    },
  };
  try {
    dynClient.put(params).promise();
  } catch (err) {
    return err;
  }
}

createAllMember();
