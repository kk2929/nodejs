const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const url = require('url');

const Mcurriculum = Bookshelf.Model.extend({
	tableName: 'mcurriculum',
	hasTimestamps: true,
});

router.get('/', (req, res, next) => {
	var pageName = `MySQL(カリキュラム作成)`
	var pageDetail = `
・レコード新規作成(create)
・
`; console.log("----", pageName, "----");

	var query = url.parse(req.url, true).query;
	var pg = query.pg || 1;
	var pg2 = query.pg2 || 1;
	var courseid = query.courseid || 1;

	var data = {
		pg: pg,
		pg2: pg2,
		courseid: courseid,

		routespath: routespath,
		filepath: filepath,
		pageName: pageName,
		pageDetail: pageDetail,
		breadcrumb: [
			["index(単元一覧)", `${filepath}/index/?pg=${pg}`],
			["index2(カリキュラム一覧)", `${filepath}/index2/${courseid}/?pg=${pg}&pg2=${pg2}`],
		],
	};
	res.render(`${filepath}/create`, data);
});

router.post('/', (req, res, next) => {
	var query = url.parse(req.url, true).query;
	var pg = query.pg || 1;
	var pg2 = query.pg2 || 1;
	var courseid = query.courseid || 1;

	new Mcurriculum(req.body).save().then((model) => {
		res.redirect(`/manage/${filepath}/index2/${courseid}/?pg=${pg}&pg2=${pg2}`);
	});
});

module.exports = router;