const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  // mongoose = require("mongoose"),
  // User = require("../main/api/models/alisModel"), // 作成したModelの読み込み
  bodyParser = require("body-parser");

  const db = require("./db");
  db.connectDB();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require("../main/api/routes/userRoute.js"); // Routeのインポート
routes(app); //appにRouteを設定する。

app.listen(port); // appを特定のportでlistenさせる。

console.log("todo list RESTful API server started on: " + port);