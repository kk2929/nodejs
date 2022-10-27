const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const fs = require("fs");

const AWS = require('aws-sdk');	//npm install aws-sdk@2.1001.0
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: 'ap-northeast-1',
	signatureVersion: 'v4'
});

//npm install express-form-data@2.0.0
// フォームに入力されたファイルの実体をサーバー側に送信する
// .ejs のフォームに enctype='multipart/form-data' が必要
const formData = require('express-form-data');
router.use(formData.parse());

router.get('/', (req, res, next) => {
	var pageName = `${filepath}:テンプレート`
	var pageDetail = `
・ページの説明文
・2行目
`; console.log("----", pageName, "----");

	var data = {
		routespath: routespath,
		filepath: filepath,
		pageName: pageName,
		pageDetail: pageDetail,
	};
	res.render(`${filepath}/index`, data);
});

router.post('/', (req, res, next) => {
	var inputFile = req.files.inputFile;

	(async () => {
		await uploadToS3();
		res.redirect(`/manage/${filepath}/index`);
	})();

	async function uploadToS3() {
		return new Promise(resolve => {
			var param = {
				Bucket: process.env.S3_BUCKET_NAME,
				Key: process.env.S3_BUCKET_KEY_POSTER + '/' + inputFile.name,
				Body: fs.createReadStream(inputFile.path),
				ContentType: inputFile.mimetype
			}
			s3.upload(param, function (err, data) {
				if (err) {
					return res.status(400).send(err);
				}
				resolve();
			});
		});
	}
});

module.exports = router;