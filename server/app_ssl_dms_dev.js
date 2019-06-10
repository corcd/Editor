/* eslint-disable prettier/prettier */
let express = require("express");
let app = express();
let path = require("path");
let fs = require("fs");
let cors = require("cors");
let logger = require("morgan");
let bodyParser = require("body-parser");

// SSL
let options = {
  key: fs.readFileSync("/etc/nginx/ssl/guangdianyun.tv.key", "utf-8"),
  cert: fs.readFileSync("/etc/nginx/ssl/guangdianyun.tv_bundle.crt", "utf-8")
};
// Http & Https
let http = require("http").Server(app);
let https = require("https").Server(options, app);
let request = require("request");
// Socket.io
let io = require("socket.io")(https);
// MongoDB
let mongoose = require("mongoose");
let moment = require("moment");
// 引入模型
let db = require("./db");

// CORS 跨域
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

// let editors = []; // 编辑器对象数组
// let stages = []; // 舞台对象数组

// 用户对象
let userSchema = new mongoose.Schema({
  user_appid: String,
  user_type: String,
  date: String,
  user_ip: String
});
let UserList = mongoose.model("userlist", userSchema);
// 编辑器数据对象
let editorSchema = new mongoose.Schema({
  editor_appid: String,
  editor_data: Object,
  date: String,
  editor_ip: String
});
let EditorLib = mongoose.model("editorlib", editorSchema);

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

app.post("/setData", (req, res, next) => {
  //   let str_json = JSON.stringify(req.body);
  //   console.log(str_json);
  //   fs.writeFile("data.json", str_json, "utf8", () => {
  //     // 保存完成后的回调函数
  //     console.log("保存完成");
  //     str_json = "";
  //     res.send({
  //       code: 1
  //     });
  //   });
  //   let updateEditlib = new EditorLib({
  //     editor_appid: req.body.appid,
  //     editor_data: req.body.data,
  //     date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  //     editor_ip: ""
  //   });

  let updateObj = {
    $set: {
      editor_appid: req.body.appid,
      editor_data: req.body.data,
      date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      editor_ip: ""
    }
  };
  EditorLib.updateOne(
    {
      // eslint-disable-next-line prettier/prettier
      editor_appid: req.body.appid
    },
    updateObj,
    (err) => {
      if (err) console.log(err);
      console.log("Editor Data Updated");
      // DMS
      request(
        {
          url: "http://pub.guangdianyun.tv/v1/message/Index/send",
          method: "POST",
          json: true,
          headers: {
            "content-type": "application/json"
          },
          qs: {
            "topic": "editor",
            "cmd": "update",
            "uin": req.body.uin,
            "extra": {
              "msg": "test"
            }
          }
        },
        (error, response, body) => {
          if (!error && response.body.code == 200) {
            console.log("DMS Success");
          } else if (error) {
            console.log("DMS Error", error);
          } else {
            //console.log(uin);
            console.log("DMS Failed", response.body.code);
          }
        }
      );

      res.json({
        code: "1",
        msg: "Save Success"
      });

    }
  );
});

app.post("/getData", (req, res, next) => {
  if (req.body.type == "editor") {
    console.log(req.body.appid);

    EditorLib.findOne(
      {
        // eslint-disable-next-line prettier/prettier
        "editor_appid": req.body.appid
      },
      "editor_appid editor_data",
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result == null || result.editor_appid != req.body.appid) {
            res.json({
              code: "0",
              msg: "No User"
            });
          } else {
            res.json({
              code: "1",
              data: result.editor_data,
              msg: "Current User"
            });
          }
        }
      }
    );
  } else if (req.body.type == "stage") {
  }
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
    // if (stages.findIndex(item => item.sid === socket.id)) {
    //   stages.splice(stages.findIndex(item => item.sid === socket.id), 1);
    // }
    // if (editors.findIndex(item => item.sid === socket.id)) {
    //   editors.splice(editors.findIndex(item => item.sid === socket.id), 1);
    // }
  });

  // 上线
  socket.on("online", info => {
    if (info.type == "editor") {
      console.log("编辑器初始化", info.appid);
      //   editors.push({
      //     appid: info.appid,
      //     sid: socket.id
      //   });

      // 推入服务器数据库
      let editList = new UserList({
        user_appid: info.appid,
        user_type: info.type,
        date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        user_ip: ""
      });
      let newEditlib = new EditorLib({
        editor_appid: info.appid,
        editor_data: {
          layout: []
        },
        date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        editor_ip: ""
      });

      let updateObj = {
        $set: {
          user_appid: info.appid,
          user_type: info.type,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          user_ip: ""
        }
      };

      UserList.findOne(
        {
          // eslint-disable-next-line prettier/prettier
          "user_appid": info.appid
        },
        "user_appid",
        function(err, res) {
          if (err) {
            console.log(err);
          } else {
            if (res == null || res.user_appid != info.appid) {
              editList.save((err, raw) => {
                if (err) {
                  console.log(err);
                } else {
                  if (raw) {
                    console.log("New User's AppId is recorded ", raw);
                  } else {
                    console.log("Insert Failed");
                  }
                }
              });
              //
              newEditlib.save((err, raw) => {
                if (err) {
                  console.log(err);
                } else {
                  if (raw) {
                    console.log("New User's Editor is created ", raw);
                  } else {
                    console.log("Created Failed");
                  }
                }
              });
            } else {
              UserList.updateOne(
                {
                  user_appid: info.appid
                },
                updateObj,
                function(err) {
                  if (err) console.log(err);
                  console.log("User Updated");
                }
              );
            }
          }
        }
      );
    } else if (info.type == "stage") {
      console.log("舞台初始化", info.appid);
      //   stages.push({
      //     appid: info.appid,
      //     sid: socket.id
      //   });
      // 推入服务器数据库
    }
    socket.join(info.appid);
    //console.log(editors, stages);
    //socket.broadcast.emit("online", name);
  });

  app.post("/clear", (req, res, next) => {
    console.log(req.body);
    socket.broadcast.to(req.body.appid).emit("clearStage");

    console.log("舞台数据清除");
    res.send({
      code: 1
    });
    // 清除舞台数据库
  });

  app.post("/apply", (req, res, next) => {
    console.log(req.body);
    socket.broadcast.to(req.body.appid).emit("onceUpdate");
    // DMS
    request(
      {
        url: "http://pub.guangdianyun.tv/v1/message/Index/send",
        method: "POST",
        json: true,
        headers: {
          "content-type": "application/json"
        },
        qs: {
          "topic": "editor",
          "cmd": "apply",
          "uin": req.body.uin,
          "extra": {
            "msg": "test"
          }
        }
      },
      (error, response, body) => {
        if (!error && response.body.code == 200) {
          console.log("DMS Success");
        } else if (error) {
          console.log("DMS Error", error);
        } else {
          console.log("DMS Failed", response.body.code);
        }
      }
    );

    console.log("请求编辑器更新舞台数据");
    res.send({
      code: 1
    });
  });

  // 坐标
  socket.on("sendMsg", data => {
    console.log("编辑器数据发生更新", data);
    socket.broadcast.to(data.appid).emit("receiveMsg", data.data);
  });

  // 预览
  socket.on("sendMsgPre", data => {
    console.log("编辑器数据发生更新（预览）", data);
    socket.broadcast.to(data.appid).emit("receiveMsgPre", data.data);
  });
});

http.listen(3005, () => {
  console.log("http listening on*:3005");
});
https.listen(3006, () => {
  console.log("https listening on*:3006");
});
