const mongoose = require("mongoose");
// 一般的には, `mongodb://localhost/test` の指定になります
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
// mongoose.connect('mongodb://mongo/test', {useNewUrlParser: true});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongo 接続エラー ctrl + c:"));
db.once("open", () => {
  console.log("DB接続中... You can cancel from ctrl + c");
});
const kittySchema = mongoose.Schema({
  name: String,
});

// const Kitten = mongoose.model("Kitten", kittySchema);

// const silence = new Kitten({
//   name: "Silence",
// });

// console.log(silence.name);

kittySchema.methods.speak = function () {
  const noName = "名前はまだ無い";
  const greeting = this.name ? "みゃ〜の名前は " + this.name : noName;
  console.log(greeting);
};

// kittySchema.methods.speak();

const Kitten = mongoose.model("Kitten", kittySchema);

const tama = new Kitten({ name: "Tama" });
// tama.speak();

// 確実にsave してから　find したいので 関数にしている
async function tamaFunc() {
  await tama.save((err, kitten) => {
    if (err) console.error(err);
    console.log(kitten);
  });

  await Kitten.find((err, kittens) => {
    if (err) console.error(err);
    console.log(kittens);
  });
}
tamaFunc();
