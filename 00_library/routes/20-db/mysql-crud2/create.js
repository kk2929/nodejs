const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const url = require('url');

const Mcourse = Bookshelf.Model.extend({
	tableName: 'mcourse',
	hasTimestamps: true,
});

router.get('/', (req, res, next) => {
	var pageName = `MySQL(mysql-crud-create)`
	var pageDetail = `
・レコード新規作成(create)
・
`; console.log("----", pageName, "----");

	var query = url.parse(req.url, true).query;
	var pg = query.pg || 1;

	var grade = req.cookies.courseFilter.grade
	grade = ["all", "other"].includes(grade) ? 2 : grade

	var data = {
		grade: grade,
		pg: pg,

		routespath: routespath,
		filepath: filepath,
		pageName: pageName,
		pageDetail: pageDetail,
		breadcrumb: [
			["index(一覧)", `${filepath}/index/?pg=${pg}`],
		],
	};
	res.render(`${filepath}/create`, data);
});

router.post('/', (req, res, next) => {
	var query = url.parse(req.url, true).query;
	var pg = query.pg || 1;

	new Mcourse(req.body).save().then((model) => {
		res.redirect(`/manage/${filepath}/index/?pg=${pg}`);
	});
});

module.exports = router;