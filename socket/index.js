// var http = require("../app");
// var io = require("socket.io")(http, { cors: true });

// app.get('/socket.io.js', function (req, res) {
//   res.sendFile(__dirname + '/socket.io.js');
// });

// io.use('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
// io.use('origins', '*:*');
// io.emit('some event', { for: 'everyone' });
// io.engine.generateId = (req) => {
//   console.log('req',req)
//   console.log('req',req.query)
//   return "custom:id:" + 1111; // custom id must be unique
// }

// app.post('/chatInitUser', function (req, res) {
//   const { title, info, content, markdown, author, saveImageUrl, paperUseImg, hasTags, hasFolder } = req.body
//   // res.sendFile(__dirname + '/socket.io.js');
// })

let allClients = [];
const activeUsers = new Map(); // 存储已连接的用户

function searchUser(socket) {
  return allClients.filter((e) => e.id === socket.id)[0];
}
function removeUser(socket) {
  allClients = allClients.filter((e) => e.id !== socket.id);
}

module.exports = {
  getUserList: () => activeUsers,
  server: (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.query.token; // 获取用户 token
        // console.log(token,token);
        // console.log('activeUsers',activeUsers);
        if (!token) {
            return next(new Error('未授权的用户'));
        }
    
        // 检查该 token 是否已连接
        if (activeUsers.has(token)) {
            // 如果该用户已经连接，断开旧的连接
            const oldSocket = activeUsers.get(token);
            oldSocket.disconnect(true); // 强制断开旧连接
        }
    
        // 记录新连接
        activeUsers.set(token, socket);
        next();
    });
    io.on("connection", function (socket) {
    //   console.log(socket);
    //   console.log(socket.query);
    //   console.log(socket.id);

    //   allClients.push({
    //     name: 'msg',
    //     id: socket.id,
    //   });

      socket.on("chat_message", function (msg) {
        const user = searchUser(socket);
        // console.log('user', user)
        // console.log('userNmae', user.name)
        io.emit("chat_message", { name: user.name, msg });
      });

      socket.on("chat_newUser", function (msg) {
        allClients.push({
          name: msg,
          id: socket.id,
        });
        io.emit("chat_newuser", { name: msg, id: socket.id });
        io.emit("chat_roomusers", allClients);
      });

      socket.on("fivechess_invite", (data) => {
        io.emit(
          "fivechess_invite",
          allClients.map((e) => {
            return { ...e, camp: "black" };
          })
        );
      });

      socket.on("fivechess_accept", (data) => {
        io.emit("fivechess_accept", data);
      });

      socket.on("fivechess_turndown", (data) => {
        io.emit("fivechess_turndown", {
          msg: `拒绝`,
          name: data.name,
          id: data.id,
        });
      });

      socket.on("fivechess_movechess", (data) => {
        io.emit("fivechess_movechess", data);
      });

      // 选边
      socket.on("fivechess_selcetcamp", (data) => {
        io.emit("fivechess_selcetcamp", data);
      });

      socket.on("disconnect", function () {
        console.log("Got disconnect!");
        const user = searchUser(socket);
        if (user) {
          io.emit("fivechess_leavemessage", { msg: `${user.name}离开了` });
          removeUser(socket);
        }
      });
    });
  },
};
