require("dotenv").config();
const express = require("express");
const app = express();

// const port = 4000;

// app.listen(port, () => {
//   console.log("Server is running on Port: " + port);
// });

const db = require("./db");
db.connectDB();
