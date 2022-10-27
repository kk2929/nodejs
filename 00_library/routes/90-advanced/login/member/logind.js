const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', (req, res, next) => {
	var pageName = `ログイン後ページ(logind)`
	var pageDetail = `
・ページの説明文
・2行目
`; console.log("----", pageName, "----");

	var session = req.session.login;

	var upperFilepath = filepath
	// ここから3行は、書き方の制限が厳しいので注意。.split("/").pop().join("/") というように1行ではできなかった
	/* ファイルのパスの末尾を切る取る。[90-advanced/login/member] ⇒ [90-advanced/login] に */
	upperFilepath = upperFilepath.split("/")
	upperFilepath.pop()
	upperFilepath = upperFilepath.join("/");

	var data = {
		isLogind: session ? true : false,
		session: session,

		routespath: routespath,
		filepath: filepath,
		pageName: pageName,
		pageDetail: pageDetail,
		breadcrumb: [
			// ["ログイン(index)", `${upperFilepath}/index/`],
		],
	};
	res.render(`${filepath}/logind`, data);
});

module.exports = router;