const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const url = require('url');

const Mcourse = Bookshelf.Model.extend({
	tableName: 'mcourse',
	hasTimestamps: true,
});

router.get('/:id', (req, res, next) => {
	var pageName = `MySQL(mysql-crud-edit)`
	var pageDetail = `
・レコード編集・削除(edit)
・
`; console.log("----", pageName, "----");

	var query = url.parse(req.url, true).query;
	var pg = query.pg || 1;
	var id = req.params.id;

	Mcourse.query({ where: { id: req.params.id } }).fetch().then((model) => {
		var data = {
			data: model.attributes,
			pg: pg,
			id: id,

			routespath: routespath,
			filepath: filepath,
			pageName: pageName,
			pageDetail: pageDetail,
			breadcrumb: [
				["index(一覧)", `${filepath}/index/?pg=${pg}`],
			],
		}
		res.render(`${filepath}/edit`, data);
	});
});

router.post('/:id', (req, res, next) => {
	var query = url.parse(req.url, true).query;
	var pg = query.pg || 1;

	new Mcourse({ id: req.params.id }).save(req.body, { patch: true }).then((model) => {
		res.redirect(`/manage/${filepath}/index/?pg=${pg}`);
	});
});

router.post('/:id/delete', (req, res, next) => {
	var query = url.parse(req.url, true).query;
	var pg = query.pg || 1;
	var del_id = query.id;

	knex('mcourse').where('id', '=', del_id).del().then((resp) => {
		console.log(resp);
		res.redirect(`/manage/${filepath}/index/?pg=${pg}`);
	});
});

module.exports = router;