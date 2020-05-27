const twitter = require("twitter");
const fs = require("fs");
const request = require("request");

// const params = {
//   list_id: list_id,
// };
const id = "ugok";
const options = {
  url: `https://alis.to/api/search/users?query=${id}`,
  method: "GET",
  json: true,
};
request(options, (error, responce, body) => {
  if (!error && body.length > 0) {
    console.log(body);
  } else if (body.length === 0) {
    console.log("データがありません");
  } else {
    console.log(error);
  }
});

function addAlisItem() {}
// client.get("lists/statuses", params, (error, tl) => {
//   if (!error) {
//     fs.appendFileSync("json/timeline.json", JSON.stringify(tl), "utf-8");
//   } else {
//     console.error(error);
//   }
// });
