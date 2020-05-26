const fs = require("fs");

// const members = JSON.parse(fs.readFileSync("json/ugokMembers.json", "utf-8"));

// for (member of members) {
//   if (member != undefined) {
//     console.log("name: " + member.name);
//   }
// }

const tweets = JSON.parse(fs.readFileSync("json/ugokMembers.json", "utf-8"));

for (tweet of tweets) {
  if (tweet != undefined) {
    console.log("name: " + tweet.name);
    console.log("content: " + tweet.status.text);
  }
}
