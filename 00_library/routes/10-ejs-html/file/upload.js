const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname);
const multer = require("multer"); //npm install multer

const File = Bookshelf.Model.extend({
  tableName: 'file',
  hasTimestamps: true,
});

// app.jsに以下を記載する
// var cors = require('cors');
// app.use(cors());

const local_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'aaa_uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const local_upload = multer({ storage: local_storage })

const nas_path = '//192.168.1.16/mail_file/';
const online_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, nas_path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const online_upload = multer({ storage: online_storage })

router.get('/', (req, res, next) => {
  console.log("get");
  var data = {
    nas_path: nas_path
  }
  res.render(`${filepath}/upload`, data);
});

router.post('/local/', local_upload.single('file'), (req, res, next) => {
  console.log(req.file);
  res.send('local upload success');
});

router.post('/online/', online_upload.single('file'), (req, res, next) => {
  console.log(req.file);
  var saveData = {
    name: "名前"
  }
  new File(saveData).save().then((model) => {
    res.send('online upload success');//.ejs側の success: function を実行するために、何らかのレスポンスが必要
  });
  // res.redirect('/manage/file/upload');//要注意点。ajaxでは機能しない
});

module.exports = router;
