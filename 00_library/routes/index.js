const express = require('express');
const router = express.Router();
routespath = __dirname;//routesフォルダのパスをグローバル変数に。他の.jsファイル内で、.ejsの指定などで使用する。

router.get('/', (req, res, next) => {
	var data = {
		tabName: `/`,
	};
	res.render('index', data);
});

module.exports = router;
