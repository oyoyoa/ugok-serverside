// todo main func の 作成
"use strict";
const twitter = require("twitter");
const { readFileSync } = require("fs");
const { DynamoDB } = require("aws-sdk");
const dynamodb = new DynamoDB({ region: "ap-northeast-1" });
const dynClient = new DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  service: dynamodb,
});
const twiClient = new twitter(
  JSON.parse(readFileSync("config/secret.json", "utf-8"))
);

async function getListItem() {
  const params = {
    TableName: "UGOKList",
    Key: {
      id: 1,
      name: "UGOK",
    },
  };
  return new Promise((resolve) => {
    dynClient.get(params, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        resolve(data.Item.twitterId);
      }
    });
  });
}

async function createMemberAll() {
  const id_str = await getListItem();
  const params = {
    list_id: id_str,
    count: 50,
  };
  twiClient.get("lists/members", params, (error, members) => {
    if (error) {
      console.error(error);
    } else {
      members.users.forEach((member, index) => {
        if (member != undefined) {
          let item = {
            id: member.id_str,
            screenName: member.screen_name,
            icon: member.profile_image_url,
          };
          createMember(item, member.name, index);
        }
      });
    }
  });
}

function createMember(item, name, index) {
  const params = {
    TableName: "Member",
    Item: {
      userId: index + 1,
      name: name,
      twitter: item,
      alis: {
        id: item.screenName,
      },
    },
  };
  try {
    dynClient.put(params).promise();
  } catch (error) {
    return error;
  }
}

createMemberAll();
