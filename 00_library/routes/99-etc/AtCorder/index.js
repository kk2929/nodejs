const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', (req, res, next) => {
	var pageName = `${filepath}:AtCorder`
	var pageDetail = `
・ページの説明文
・2行目
`; console.log("----", pageName, "----");

	Main(`1
1 1 1
1
5 5`)

	var data = {
		routespath: routespath,
		filepath: filepath,
		pageName: pageName,
		pageDetail: pageDetail,
	};
	res.render(`${filepath}/index`, data);
});

// inputに入力データ全体が入る
function Main(input) {
	input = input.split("\n");
	console.log(input);

	var field = []
	for (let i = 0; i < 30; i++) {
		field[i] = []
		for (let j = 0; j < 30; j++) {
			field[i][j] = "."
		}
	}

	var n = Number(input[0])
	var p = []
	var m = Number(input[1 + n])
	var h = []
	for (let i = 0; i < n; i++) {
		p[i] = input[1 + i].split(" ").map(e => { return Number(e) })
		field[p[i][0] - 1][p[i][1] - 1] = `p${i}${p[i][2]}`
	}
	for (let i = 0; i < m; i++) {
		h[i] = input[2 + n + i].split(" ").map(e => { return Number(e) })
		field[h[i][0] - 1][h[i][1] - 1] = `h${i}`
	}
	console.log(p);
	console.log(h);

	showField(field);


}

function showField(field) {
	for (let i = 0; i < field.length; i++) {
		console.log(field[i].join(""))
	}
}
//*この行以降は編集しないでください（標準入出力から一度に読み込み、Mainを呼び出します）
// Main(require("fs").readFileSync("/dev/stdin", "utf8"));

module.exports = router;
