const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routes フォルダから見たこのファイルの相対パス

const url = require('url');

const oracledb = require('oracledb');
/* DB接続情報を読み込む */
const dbConfig = require(`${routespath}/../public/js/dbConfig.js`).dbConfig;

router.get('/', (req, res, next) => {
	var pageName = `oracle edit`
	var pageDetail = `
・oracledb を使用したCRUD(update, delete)
・左下の「更新」で update、右下の「削除」で delete
`; console.log("----", pageName, "----");

	var query = url.parse(req.url, true).query;
	var id = query.id;

	(async function () {
		let connection;
		try {
			/* DB接続 */
			connection = await oracledb.getConnection(dbConfig);

			/* SQL文を指定 */
			const sql = `select * from test1 where id = ${id}`

			/* SQLを実行 */
			let result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

			var data = {
				rows: result.rows,
				dateUtils: require("date-utils"),

				routespath: routespath,
				filepath: filepath,
				pageName: pageName,
				pageDetail: pageDetail,
				breadcrumb: [
					["index(一覧)", `${filepath}/index/`],
				],
			};
			res.render(`${filepath}/edit`, data);

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

router.post('/update/', (req, res, next) => {
	var pageName = `oracle update`
	console.log("----", pageName, "----");

	var query = url.parse(req.url, true).query;
	var id = query.id;

	var record = req.body;

	(async function () {
		let connection;
		try {
			connection = await oracledb.getConnection(dbConfig);

			/* SQL文を指定。:1, :2 などには 配列row の値が入る */
			const sql = `UPDATE test1 SET str_ = :1, num_ = :2, date_ = :3 where id = ${id}`
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

router.post('/delete/', (req, res, next) => {
	var pageName = `oracle delete`
	console.log("----", pageName, "----");

	var query = url.parse(req.url, true).query;
	var id = query.id;

	(async function () {
		let connection;
		try {
			connection = await oracledb.getConnection(dbConfig);

			const sql = `DELETE FROM test1 where id = ${id}`

			/* SQLを実行。INSERT, UPDATE, DELETE は実行後に commit が必要 */
			await connection.execute(sql);
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
