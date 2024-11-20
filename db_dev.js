var mongoose = require("mongoose");

// mongoose.connect("mongodb+srv://<username>:<password>@cluster0.eyhty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

// mongodbVSCodePlaygroundDB

// mongoose.connect(`mongodb://${mongoUsername}:${mongoPasswd}@${ip}:${port}/${database}`); // 连接数据库

const ip = "127.0.0.1"; //'localhost'
const port = 27017;
const database = "test1"; //'mongodbVSCodePlaygroundDB'

console.log(`mongodb://${ip}:${port}/${database}`);
mongoose.connect(`mongodb://${ip}:${port}/${database}`); // 连接数据库

var db = mongoose.connection;
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
