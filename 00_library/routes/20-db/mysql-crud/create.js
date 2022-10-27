const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const Test_table1 = Bookshelf.Model.extend({
	tableName: 'test_table1',
	hasTimestamps: true,
});

router.get('/', (req, res, next) => {
	var pageName = `MySQL(mysql-crud-create)`
	var pageDetail = `
・レコード新規作成(create)
・
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
	new Test_table1(req.body).save().then((model) => {
		res.redirect(`/manage/${filepath}/index/`);
	});
});

module.exports = router;