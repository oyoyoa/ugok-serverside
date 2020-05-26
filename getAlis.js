const twitter = require("twitter");
const fs = require("fs");
const https = require("https");
const client = new twitter(JSON.parse(fs.readFileSync("secret.json", "utf-8")));

// const params = {
//   list_id: list_id,
// };
const id = "ugok";
const options = {
  url: `https://alis.to/api/search/users?query= ${id}`,
  method: "GET",
  json: true,
};

https.request(options, (error, response) => {
  console.log(error);
  //   if (!error) {
  //     console.log(response);
  //   } else {
  //     console.log(error);
  //   }
});
// client.get("lists/statuses", params, (error, tl) => {
//   if (!error) {
//     fs.appendFileSync("json/timeline.json", JSON.stringify(tl), "utf-8");
//   } else {
//     console.error(error);
//   }
// });
