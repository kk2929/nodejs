const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

const Users = Bookshelf.Model.extend({
	tableName: 'users'
});

router.get('/', (req, res, next) => {
	var pageName = `ログイン(index)`
	var pageDetail = `
・ページの説明文
・2行目
`; console.log("----", pageName, "----");

	var session = req.session.login;

	var data = {
		message: '<p>・名前とパスワードを入力して下さい</p>',
		isLogind: session ? true : false,
		session: session,

		routespath: routespath,
		filepath: filepath,
		pageName: pageName,
		pageDetail: pageDetail,
	};
	res.render(`${filepath}/index`, data);
});

router.post('/', (req, res, next) => {
	var pageName = `ログイン(index)`
	var pageDetail = `
・ページの説明文
・2行目
`; console.log("----", pageName, "----");

	req.check('name', '名前 は必ず入力して下さい').notEmpty();
	req.check('password', 'パスワード は必ず入力して下さい').notEmpty();
	req.getValidationResult().then((result) => {
		if (!result.isEmpty()) {
			console.log('バリデーションエラー');
			var message = '<ul class="error">';
			var result_arr = result.array();
			for (var n in result_arr) {
				message += '<li>' + result_arr[n].msg + '</li>'
			}
			message += '</ul>';
			var data = {
				message: message,
				session: req.session.login,

				routespath: routespath,
				filepath: filepath,
				pageName: pageName,
				pageDetail: pageDetail,
			}
			res.render(`${filepath}/index`, data);
		} else {
			console.log('ログイン判定');
			var nm = req.body.name;
			var pw = req.body.password;
			Users.query({ where: { name: nm }, andWhere: { password: pw } }).fetch().then((model) => {
				console.log('名前, パスワードに一致するユーザーが存在');
				req.session.login = model.attributes;
				console.log('■ req.session.login\n', req.session.login);
				res.redirect(`/manage/${filepath}/member/logind/`);

			}).catch((err) => {
				console.log('該当ユーザーが存在しない');
				var data = {
					message: '<p class="error">名前またはパスワードが違います</p>',

					routespath: routespath,
					filepath: filepath,
					pageName: pageName,
					pageDetail: pageDetail,
				};
				res.render(`${filepath}/index`, data);
			});
		};
	});
});

module.exports = router;