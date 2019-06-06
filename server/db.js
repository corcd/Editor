//引用mongoose模块
let mongoose = require("mongoose");
let moment = require("moment");
mongoose.Promise = global.Promise;

const dbUrl = "mongodb://localhost:27017/editor";
//连接数据库
mongoose.connect(dbUrl, {
  keepAlive: 120,
  useNewUrlParser: true
});

const db = mongoose.connection;

db.once("open", () => console.log("MongoDB 连接成功"));
db.on("error", () => {
  console.log("MongoDB 连接失败");
  mongoose.disconnect();
});
db.on("close", function () {
  console.log("MongoDB 连接断开，重新连接数据库");
  mongoose.connect(dbUrl, {
    server: {
      auto_reconnect: true
    }
  });
});

module.exports = db;