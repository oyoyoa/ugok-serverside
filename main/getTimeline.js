const twitter = require("twitter");
const fs = require("fs");
const client = new twitter(JSON.parse(fs.readFileSync("secret.json", "utf-8")));

const list_obj = JSON.parse(fs.readFileSync("json/lists.json", "utf-8"));
const list_id = list_obj[0].id_str;

const params = {
  list_id: list_id,
};

client.get("lists/statuses", params, (error, tl) => {
  if (!error) {
    fs.appendFileSync("json/timeline.json", JSON.stringify(tl), "utf-8");
  } else {
    console.error(error);
  }
});
