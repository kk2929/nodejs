const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routes フォルダから見たこのファイルの相対パス

const oracledb = require('oracledb');
/* DB接続情報を読み込む */
const dbConfig = require(`${routespath}/../public/js/dbConfig.js`).dbConfig;

router.get('/', (req, res, next) => {
	var pageName = `oracle create (get)`
	var pageDetail = `
・oracledb を使用したCRUD(create)
・NUM_はデータ型の宣言で桁数制限があるので注意。今は30桁以下に設定しているはず
`; console.log("----", pageName, "----");

	var data = {
		routespath: routespath,
		filepath: filepath,
		pageName: pageName,
		pageDetail: pageDetail,
		breadcrumb: [
			["index(一覧)", `${filepath}/index/`],
		],
	};
	res.render(`${filepath}/create`, data);
});

router.post('/', (req, res, next) => {
	var pageName = `oracle create (post)`
	console.log("----", pageName, "----");

	var record = req.body;

	(async function () {
		let connection;
		try {
			connection = await oracledb.getConnection(dbConfig);

			/* SQL文を指定。:1, :2 などには 配列row の値が入る */
			const sql = `INSERT INTO test1 (str_, num_, date_) values(:1, :2, :3)`
			const row = [record.str_, record.num_, record.date_]

			/* SQLを実行。INSERT, UPDATE, DELETE は実行後に commit が必要 */
			await connection.execute(sql, row);
			await connection.commit();

			res.redirect(`/manage/${filepath}/index/`);

		} catch (err) {
			console.error(err);
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (err) {
					console.error(err);
				}
			}
		}
	})();
});

module.exports = router;
