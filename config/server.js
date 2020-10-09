const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require("mongoose"),
  User = require("./api/models/userkModel"), // 作成したModelの読み込み
  bodyParser = require("body-parser");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/Ugokdb");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require("./api/routes/userkRoutes"); // Routeのインポート
routes(app); //appにRouteを設定する。

app.listen(port); // appを特定のportでlistenさせる。

console.log("ugok list RESTful API server started on: " + port);
