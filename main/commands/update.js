const cron = require('node-cron'),
    db = require("../../config/db"),
    {createTweetsJson} = require("./twitter/createTweetsJson"),
    {getTweetsWeek} = require("./twitter/getTweetsWeek"),
    {getTweetsHalf} = require("./twitter/getTweetsHalf"),
    {getTweetsAll} = require("./twitter/getTweetsAll"),
    {getAlisWeek} = require("./alis/getAlisPostsWeek"),
    {getAlisHalf} = require("./alis/getAlisPostsHalf"),
    {getAlisAll} = require("./alis/getAlisPosts");

function main () {
    db.connectDB();
    console.log("Update start");
    createTweetsJson();
    getTweetsWeek();
    getTweetsHalf();
    getTweetsAll();
    getAlisWeek();
    getAlisHalf();
    getAlisAll();
    // console.log("Update end");
} 

main();