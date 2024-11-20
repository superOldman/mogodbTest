const mongoose = require("mongoose");

const ip = "47.103.103.254"; //'localhost'
const port = 27017;
let database = "admin";

const mongoUsername = "kimi";
const mongoPasswd = "Az6967668";
// mongodb://kimi:Az6967668@47.103.103.254/

const URI = `mongodb://${mongoUsername}:${mongoPasswd}@${ip}/${database}`;
// `mongodb://${mongoUsername}:${mongoPasswd}@${ip}:${port}/${database}`

console.log(URI);
mongoose.connect(URI); // 连接数据库

const db = mongoose.connection;

db.on("error", function callback() {
  // 监听是否有异常
  console.log("Connection error");
});
db.once("open", function callback() {
  // 监听一次打开
  // 在这里创建你的模式和模型
  console.log("we are connected!");
});

module.exports = mongoose;
