const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', (req, res, next) => {
	var pageName = `MySQL(mysql-crud)`
	var pageDetail = `
・ページの説明文
・2行目
`; console.log("----", pageName, "----");

	var sqlTex = `
			SELECT *
			FROM test_table1
			;`
	connection.query(
		sqlTex,
		(error, results) => {
			var data = {
				data: results,
				dateUtils: require("date-utils"),

				routespath: routespath,
				filepath: filepath,
				pageName: pageName,
				pageDetail: pageDetail,
			};
			res.render(`${filepath}/index`, data);
		}
	)
});

module.exports = router;