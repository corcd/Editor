let express = require("express");
let app = express();
let path = require("path");
let fs = require("fs");
let cors = require("cors");
let logger = require("morgan");
let bodyParser = require("body-parser");
//let multer = require("multer");
let http = require("http").Server(app);
let io = require("socket.io")(http);

// 跨域
let allowCors = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
};
app.use(allowCors); //使用跨域中间件
app.use(logger("dev"));

//const upload = multer({ dest: __dirname + "/tmp/img" }); //设置上传的目录文件夹

app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "../public/index.html");
});

// 引入七牛云配置
const qnconfig = require("./config.js");
// 处理请求
app.get("/token", (req, res, next) => {
  // console.log(qnconfig.uploadToken)
  res.status(200).send(qnconfig.uploadToken);
});

app.post("/data", (req, res, next) => {
  let str_json = JSON.stringify(req.body);
  console.log(str_json);
  fs.writeFile("data.json", str_json, "utf8", () => {
    // 保存完成后的回调函数
    console.log("保存完成");
  });
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
