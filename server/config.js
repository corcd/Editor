/*
七牛云配置
*/
const qiniu = require("qiniu");

// 创建上传凭证
const accessKey = "hPjZbE1aAyDgPRi5J3vlIPwN0JUrtvg1StgOG5zi";
const secretKey = "kEMmHIN1nbjP7j_uvq95FBmkaf3KpBk1cqx8IVJ3";
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const options = {
  scope: "images-oss",
  expires: 7200
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

module.exports = {
  uploadToken
};
