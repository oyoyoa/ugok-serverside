const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require("body-parser"),
  db = require("./db");
db.connectDB();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// cors設定
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const routes = require("../main/api/routes/userRoute.js"); // Routeのインポート
routes(app); //appにRouteを設定する。

app.listen(port); // appを特定のportでlistenさせる。

const cron = require('node-cron'),
  {createTweetsJson} = require("../main/commands/twitter/createTweetsJson"),
  {getTweetsWeek} = require("../main/commands/twitter/getTweetsWeek"),
  {getTweetsHalf} = require("../main/commands/twitter/getTweetsHalf"),
  {getTweetsAll} = require("../main/commands/twitter/getTweetsAll"),
  {getAlisWeek} = require("../main/commands/alis/getAlisPostsWeek"),
  {getAlisHalf} = require("../main/commands/alis/getAlisPostsHalf"),
  {getAlisAll} = require("../main/commands/alis/getAlisPosts");
cron.schedule('00 3 * * 3', function(){
  createTweetsJson();
  getTweetsWeek();
  getTweetsHalf();
  getTweetsAll();
  getAlisWeek();
  getAlisHalf();
  getAlisAll();
});

console.log("RESTful API server started on: " + port);