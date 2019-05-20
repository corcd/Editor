let express = require("express");
let app = express();
let path = require("path");
let http = require("http").Server(app);
let io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "../public/index.html");
});

//客户端连接
io.on("connection", socket => {
  console.log("客户端连接", socket.id);
  //客户端连接失败
  socket.on("connect_failed", () => {
    console.log("connect_failed to Server");
  });
  //客户端连接出错
  socket.on("error", () => {
    console.log("error");
    alert("connect error");
  });
  //客户端重连中
  socket.on("reconnecting", () => {
    console.log("reconnecting");
  });
  //客户端重连成功
  socket.on("reconnect", () => {
    console.log("reconnect");
  });
  //客户端断开连接
  socket.on("disconnect", () => {
    console.log("客户端断开连接", socket.id);
  });

  // 上线
  socket.on("online", name => {
    console.log("客户端上线", name);
    socket.broadcast.emit("online", name);
  });

  // 坐标
  socket.on("sendMsg", data => {
    console.log("客户端坐标数据获取", data);
    socket.broadcast.emit("receiveMsg", data);
  });
});

http.listen(3006, () => {
  console.log("listening on*:3006");
});