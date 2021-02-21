
const cron = require('node-cron'),
    tweet = require("../main/commands/twitter/createTweetsJson"),
    tWeek = require("../main/commands/twitter/getTweetsWeek"),
    tHalf = require("../main/commands/twitter/getTweetsHalf"),
    tAll = require("../main/commands/twitter/getTweetsAll"),
    aWeek = require("../main/commands/alis/getAlisPostsWeek"),
    aHalf = require("../main/commands/alis/getAlisPostsHalf"),
    aAll = require("../main/commands/alis/getAlisPosts");

cron.schedule('00 3 * * 3', function(){
    tweet.createTweetsJson();
    tWeek.getTweetsWeek();
    tHalf.getTweetsHalf();
    tAll.getTweetsAll();
    aWeek.getAlisWeek();
    aHalf.getAlisHalf();
    aAll.getAlisAll();
    });