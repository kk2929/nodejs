const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const oracledb = require('oracledb');
/* DB接続情報を読み込む */
const dbConfig = require(`${routespath}/../public/js/dbConfig.js`).dbConfig;

router.get('/', (req, res, next) => {
	var pageName = `oracle`
	var pageDetail = `
・oracledb を使用したCRUD(read)
・行をクリックで、そのレコードの編集・削除画面へ
`; console.log("----", pageName, "----");

	(async function () {
		let connection;
		try {
			/* DB接続 */
			connection = await oracledb.getConnection(dbConfig);

			/* SQL文を設定 */
			const sql = `select * from test1`

			/* SQLを実行 */
			let result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

			var data = {
				rows: result.rows,
				dateUtils: require("date-utils"),

				routespath: routespath,
				filepath: filepath,
				pageName: pageName,
				pageDetail: pageDetail,
			};
			res.render(`${filepath}/index`, data);

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
