const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', (req, res, next) => {
	var pageName = `${filepath}:テンプレート(page2)`
	var pageDetail = `
・ページの説明文
・2行目
`; console.log("----", pageName, "----");

	var data = {
		routespath: routespath,
		filepath: filepath,
		pageName: pageName,
		pageDetail: pageDetail,
		breadcrumb: [
			["テンプレート(index)", `${filepath}/index/`],
		],
	};
	res.render(`${filepath}/page2`, data);
});

module.exports = router;
