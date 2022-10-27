const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const url = require('url');

router.get('/', (req, res, next) => {
	console.log("get");
	access(req, res, next)
});

router.post('/', (req, res, next) => {
	console.log("post");
	access(req, res, next)
});

function access(req, res, next) {
	var pageName = `MySQL(mysql-crud)`
	var pageDetail = `
・ページの説明文
・2行目
`; console.log("----", pageName, "----");

	var query = url.parse(req.url, true).query;
	var pg = query.pg || 1;
	pg *= 1;       //乗算代入、整数値に直すため？
	if (pg < 1) pg = 1;      //ページ数が意図しない値のとき１にする.超入門P365参照

	const module = require(`${routespath}/../public/js/cookie.js`);
	var filterData = module.courseFilter(req, res)
	var rowLimit = module.rowLimit(req, res)

	var grade = filterData.grade
	var sqlPart1
	if (grade == "all") sqlPart1 = ""
	else if (grade == "other") sqlPart1 = "AND NOT(grade >= 2 AND grade <= 6) OR grade IS NULL"
	else sqlPart1 = `AND grade = ${grade}`

	var sqlTex = `
			SELECT *,
				COUNT(*) OVER() AS rowCo
			FROM mcourse
			WHERE 1 = 1
				${sqlPart1}
			ORDER BY mcourse.exeorder, mcourse.grade
			limit ?,?;`
	connection.query(
		sqlTex,
		[rowLimit * (pg - 1), rowLimit],
		(error, results) => {
			var rowCo = (results && results[0]) ? results[0].rowCo : 0;
			if (rowCo == 0 && pg != 1) return res.redirect(`/manage/${filepath}/index/?pg=1`);
			var data = {
				data: results,
				dateUtils: require("date-utils"),

				grade: grade,
				pg: pg,
				rowLimit: rowLimit,
				pgco: Math.floor((rowCo - 1) / rowLimit) + 1,  //総ページ数

				routespath: routespath,
				filepath: filepath,
				pageName: pageName,
				pageDetail: pageDetail,
			};
			res.render(`${filepath}/index`, data);
		}
	)
};

module.exports = router;