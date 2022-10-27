const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', (req, res, next) => {
	var pageName = `${filepath}:テンプレート`
	var pageDetail = `
・ページの説明文
・2行目
`; console.log("----", pageName, "----");

	var data = {
		routespath: routespath,
		filepath: filepath,
		pageName: pageName,
		pageDetail: pageDetail,
	};
	res.render(`${filepath}/index`, data);
});

module.exports = router;
