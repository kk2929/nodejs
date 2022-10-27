const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const url = require('url');

const Mcurriculum = Bookshelf.Model.extend({
	tableName: 'mcurriculum',
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
	var pg2 = query.pg2 || 1;
	var courseid = query.courseid || 1;
	var id = req.params.id;

	Mcurriculum.query({ where: { id: req.params.id } }).fetch().then((model) => {
		var data = {
			data: model.attributes,
			pg: pg,
			pg2: pg2,
			courseid: courseid,
			id: id,

			routespath: routespath,
			filepath: filepath,
			pageName: pageName,
			pageDetail: pageDetail,
			breadcrumb: [
				["index(単元一覧)", `${filepath}/index/?pg=${pg}`],
				["index2(カリキュラム一覧)", `${filepath}/index2/${courseid}/?pg=${pg}&pg2=${pg2}`],
			],
		}
		res.render(`${filepath}/edit`, data);
	});
});

router.post('/:id', (req, res, next) => {
	var query = url.parse(req.url, true).query;
	var pg = query.pg || 1;
	var pg2 = query.pg2 || 1;
	var courseid = query.courseid || 1;

	new Mcurriculum({ id: req.params.id }).save(req.body, { patch: true }).then((model) => {
		res.redirect(`/manage/${filepath}/index2/${courseid}/?pg=${pg}&pg2=${pg2}`);
	});
});

router.post('/:id/delete', (req, res, next) => {
	var query = url.parse(req.url, true).query;
	var pg = query.pg || 1;
	var pg2 = query.pg2 || 1;
	var courseid = query.courseid || 1;
	var del_id = req.params.id;

	knex('mcurriculum').where('id', '=', del_id).del().then((resp) => {
		console.log(resp);
		res.redirect(`/manage/${filepath}/index2/${courseid}/?pg=${pg}&pg2=${pg2}`);
	});
});

module.exports = router;