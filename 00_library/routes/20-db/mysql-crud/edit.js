const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const Test_table1 = Bookshelf.Model.extend({
	tableName: 'test_table1',
	hasTimestamps: true,
});

router.get('/:id', (req, res, next) => {
	var pageName = `MySQL(mysql-crud-edit)`
	var pageDetail = `
・レコード編集・削除(edit)
・
`; console.log("----", pageName, "----");

	Test_table1.query({ where: { id: req.params.id } }).fetch().then((model) => {
		var data = {
			data: model.attributes,

			routespath: routespath,
			filepath: filepath,
			pageName: pageName,
			pageDetail: pageDetail,
			breadcrumb: [
				["index(一覧)", `${filepath}/index/`],
			],
		}
		res.render(`${filepath}/edit`, data);
	});
});

router.post('/:id', (req, res, next) => {
	new Test_table1({ id: req.params.id }).save(req.body, { patch: true }).then((model) => {
		res.redirect(`/manage/${filepath}/index/`);
	});
});

router.post('/:id/delete', (req, res, next) => {
	knex('test_table1').where('id', '=', req.params.id).del().then((resp) => {
		console.log(resp);
		res.redirect(`/manage/${filepath}/index/`);
	});
});

module.exports = router;