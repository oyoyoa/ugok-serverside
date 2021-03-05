const cron = require('node-cron'),
    {createTweetsJson} = require("../main/commands/twitter/createTweetsJson"),
    {getTweetsWeek} = require("../main/commands/twitter/getTweetsWeek"),
    {getTweetsHalf} = require("../main/commands/twitter/getTweetsHalf"),
    {getTweetsAll} = require("../main/commands/twitter/getTweetsAll"),
    {getAlisWeek} = require("../main/commands/alis/getAlisPostsWeek"),
    {getAlisHalf} = require("../main/commands/alis/getAlisPostsHalf"),
    {getAlisAll} = require("../main/commands/alis/getAlisPosts");

async function main () {
    createTweetsJson();
    getTweetsWeek();
    getTweetsHalf();
    getTweetsAll();
    getAlisWeek();
    getAlisHalf();
    getAlisAll();
} 

main();