# ugok-serverside

## API
---
* 全ユーザの取得　【GET】 `/users`

    `curl -X GET "https://ugok-app.herokuapp.com/api/users" -H  "accept: application/json"`

* ユーザごとの情報取得【GET】 `/user/{id}`

    `curl -X GET "https://ugok-app.herokuapp.com/api/user/6041df26f8885157a67e01cb" -H  "accept: application/json"`

<br>

## 保存の流れ
---

1. ツイートファイルを読み込む
2. ツイートのデータを保存する
3. ブログのデータを保存する



## Twitter
---
### ツイートファイルを読み込む

`node main/commands/twitter/createTweetsJson.js`

### ツイートのデータを保存する

* 全て

    `node main/commands/twitter/getTweetsAll.js`

* 半期

    `node main/commands/twitter/getTweetsHalf.js`

* 1週間

    `node main/commands/twitter/getTweetsWeek.js`

<br>

## ブログのデータを保存する
---
* 全て

    `node main/commands/alis/getAlisPosts.js`

* 半期

    `node main/commands/alis/getAlisPostsHalf.js`

* 1週間

    `node main/commands/alis/getAlisPostsWeek.js`

<br>

## その他
---

* ユーザ登録(UGOKまとめのリストに登録されている人物)
    
    `node main/commands/createUser.js`

* ブログユーザ登録(Twitter名から検索)
    
    `node main/commands/alis/getAlis.js`

    
