const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");

router.get('/', (req, res, next) => {
	var pageName = `tips(便利処理まとめ)`
	console.log("----", pageName, "----");

	var obj0
	var obj1 = {
		p1: "p1a",
		p2ary: ["p2a", "p2b", "p2c"],
		p3: {
			p31: "obj1.p3.p31 のプロパティ"
		},
	}

	console.log("1:", obj0);		//undefined
	// console.log("2:", obj1.p0);	//エラー。undefinedのプロパティを読んでしまう。

	/* &&（短絡評価）を使用することで、undefinedのプロパティを読んでしまうことを回避 */
	if (obj0 && obj0.p0) console.log("3:", obj0.p0.p00);//出力なし。存在しないプロパティを読んでもエラーにならない
	if (obj1 && obj1.p3) console.log("4:", obj1.p3.p31);//出力：obj1.p3.p31 のプロパティ

	var a = undefined || 1;	//代入しようとした値が「undefined・空文字・null」だった場合、代わりに 1 を代入
	console.log("5:", a);

	a = null || 2;
	console.log("6:", a);

	a = "" || 3;
	console.log("7:", a);


	var data = {
		filepath: filepath,
		pageName: pageName,
		pageDetail: `
・ページの説明文
・2行目
`,
	};
	res.render(`${filepath}/index`, data);
});

module.exports = router;
