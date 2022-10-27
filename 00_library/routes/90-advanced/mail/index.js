const express = require('express');
const router = express.Router();
const path = require('path');
const sgMail = require('@sendgrid/mail');//npm install @sendgrid/mail
const fs = require('fs');
/* formで　enctype="multipart/form-data"　を使用するために、npm install connect-multiparty をして、以下の内容をapp.jsに記述する必要がある */
// var multipart = require('connect-multiparty'); 
// app.use(multipart());

const Mail = Bookshelf.Model.extend({
	tableName: 'mail',
	// hasTimestamps: true,//テーブルのカラムにcreated_atやupdated_atがある時のみ使用する
});

const filepath = path.relative(routespath, __dirname);

router.get('/', (req, res, next) => {
	new Mail().orderBy('name').fetchAll().then((collection) => {
		var data = {
			data: collection.toArray(),
		};
		res.render(`${filepath}/index`, data);
	}).catch((err) => {
		res.status(500).json({ error: true, data: { message: err.message } });
	})
});

router.post('/send/', (req, res, next) => {
	console.log("■■■■■送信■■■■■");
	sgMail.setApiKey(process.env.SENDGRID_API_KEY); //APIキー読み込み
	/* 添付ファイルの設定 */
	var files = req.files.attachment;
	var attachments = [];
	for (let i = 0; i < files.length; i++) {
		var attpath = `${files[i].path}`;
		if (files[i].name !== "") {//空データは除く
			attachments.push(
				{
					content: fs.readFileSync(attpath).toString("base64"),
					filename: files[i].name,
					type: files[i].type
				}
			)
		}
	}
	/* 送信処理 */
	function testSend() {
		return new Promise((resolve, reject) => {
			var msg = {
				to: req.body.address,
				from: req.body.address,
				subject: req.body.subject,
				text: req.body.mailbody,
				attachments: attachments
			};
			sgMail.send(msg).then(() => {
				resolve("送信完了");
			}).catch((err) => {
				console.error("sgMail.send()でエラー\n" + err)
				reject("送信失敗");
			});
		})
	}
	testSend().then((result) => {
		console.log('--------result--------\n', result);
		res.contentType("application/json");
		res.end(JSON.stringify({ "test_send": "done" }));
	}).catch(err => {
		console.log('--------err--------\n', err);
		res.end("test_send reject");
	})
});

module.exports = router;
