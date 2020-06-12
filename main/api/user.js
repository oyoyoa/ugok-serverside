"use strict";
const { readFileSync } = require("fs");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
app.get("/", (req, res) => {
  res.send("Simple REST API");
});
const users = JSON.parse(readFileSync("json/ugokMembers.json", "utf-8"));

app.get("/api/users/", (req, res) => {
  res.send(users);
});
