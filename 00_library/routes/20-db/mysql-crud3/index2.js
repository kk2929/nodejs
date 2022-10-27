const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const url = require('url');

router.get('/:id', (req, res, next) => {
	console.log("get");
	access(req, res, next)
});

router.post('/:id', (req, res, next) => {
	console.log("post");
	access(req, res, next)
});

function access(req, res, next) {
	var pageName = `カリキュラム一覧`
	var pageDetail = `
・ページの説明文
・2行目
`; console.log("----", pageName, "----");

	var query = url.parse(req.url, true).query;
	var pg1 = query.pg || 1;
	var pg = query.pg2 || 1;
	var courseid = req.params.id || 0;

	pg *= 1;       //乗算代入、整数値に直すため？
	if (pg < 1) pg = 1;      //ページ数が意図しない値のとき１にする.超入門P365参照
	const module = require(`${routespath}/../public/js/cookie.js`);
	var rowLimit = module.rowLimit(req, res)

	var sqlTex = `
			SELECT mcurriculum.*, mcourse.courseTitle,
				COUNT(*) OVER() AS rowCo
			FROM mcurriculum
			LEFT JOIN mcourse
				ON mcourse.id = mcurriculum.courseid
			WHERE mcurriculum.courseid = ${courseid}
			ORDER BY exeorder
			limit ?,?;`
	connection.query(
		sqlTex,
		[rowLimit * (pg - 1), rowLimit],
		(error, results) => {
			var rowCo = (results && results[0]) ? results[0].rowCo : 0;
			var courseTitle = (results && results[0]) ? results[0].courseTitle : "-";
			var courseData = `・単元ID：${courseid}<br>・単元名：${courseTitle}`
			var data = {
				data: results,
				courseid: courseid,
				courseData: courseData,

				pg: pg1,
				pg2: pg,
				rowLimit: rowLimit,
				pgco: Math.floor((rowCo - 1) / rowLimit) + 1,  //総ページ数

				routespath: routespath,
				filepath: filepath,
				pageName: pageName + `(単元名:${courseTitle})`,
				pageDetail: pageDetail,
				breadcrumb: [
					["index(単元一覧)", `${filepath}/index/?pg=${pg1}`],
				],
			};
			res.render(`${filepath}/index2`, data);
		}
	)
};

module.exports = router;