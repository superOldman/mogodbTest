require("./db.js");
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: true });
const socket = require("./socket/index");
socket.server(io);

// 配置 CORS
const whitelist = ["http://www.sicilymarmot.top", "http://sicilymarmot.top"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, // 允许访问的域名
  methods: "GET,POST,PUT,DELETE", // 允许的方法
  credentials: true, // 允许携带 Cookies
};

app.use(cors(corsOptions));

const loggerMiddleware = require("./middleware/logger.js");
app.use(loggerMiddleware);

const User = require("./user/User.js");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

const secretKey = "qqqq";

app.post("/api/register", async function (req, res) {
  await create(req.body);

  res.send({
    code: 200,
    data: jwt.sign(req.body, secretKey, { expiresIn: 60 * 60 * 24 }),
    message: "创建成功",
  });
});

app.post("/api/login", async function (req, res) {
  console.log("req.body", req.body);
  const query = User.findOne(req.body);
  query
    .exec()
    .then((doc) => {
      console.log(doc);
      let resData = {};
      if (doc) {
        resData = {
          code: 200,
          data: jwt.sign(req.body, secretKey, { expiresIn: 60 * 60 * 24 }),
          message: "登录成功",
        };
      } else {
        resData = {
          code: 200,
          data: null,
          message: "用户名或者密码错误",
        };
      }

      res.send(resData);
    })
    .catch((err) => {
      if (err) {
        res.send({
          code: 200,
          data: null,
          message: "用户名或者密码错误",
        });
      }
    });
  // 错误处理
});

app.get("/api/getList", async function (req, res) {
  const token = req.headers["s-token"];
  jwt.verify(token, secretKey, (err, data) => {
    if (err) {
      res.send({
        code: 200,
        data: err,
        message: "失败",
      });
    } else {
      let theMap = socket.getUserList();
      // console.log('getUserList', theMap);

      const list = [];
      theMap.forEach((value, key, map) => {
        list.push({
          token: key,
          socketId: value.id,
        });
      });
      // 反序列化

      res.send({
        code: 200,
        data: list,
        message: "获取成功",
      });
    }
  });
});

// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   // Prints "Space Ghost is a talk show host".
//   console.log('%s %s is a %s.', person.name.first, person.name.last,
//     person.occupation);
// });

async function create(userAccount) {
  const article = await User.create(userAccount);
  article.save();
}

http.listen(4000, function (a, b) {
  console.log("listening on *:4000");
});

module.exports = http;
