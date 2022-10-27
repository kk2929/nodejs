const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', (req, res, next) => {
	console.log("ログアウトしました");

	req.session.destroy();
	res.redirect(`/manage/${filepath}/index/`);
});

module.exports = router;