const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");

router.get('/', (req, res, next) => {
	var pageName = `async基本`
	console.log("----", pageName, "----");

	/* async関数定義 */
	async function f(str = "default") {
		return new Promise(resolve => {
			setTimeout(() => {
				console.log("f()を実行：", str);
				resolve("resolve : " + str);//何故か「 , 」じゃダメで、「 + 」だとOK
			}, 500);
		});
	}

	/* async関数実行 */
	(async () => {
		console.log("■1回目開始■");
		var result = await f("1回目");
		console.log("result = ", result);
		console.log("■2回目開始■");
		result = await f("2回目");
		console.log("result = ", result);
	})();

	console.log("■■■async関数外(この行は非同期で実行されます)");

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

router.get('/a1', (req, res, next) => {
	var pageName = `再帰関数`
	console.log("----", pageName, "----");

	async function f(n, loopNum = 1) {
		return new Promise((resolve, reject) => {
			if (loopNum > 20) return resolve(n); //無限ループを防ぐ
			setTimeout(() => {
				console.log(`(loopNum, n) = (${loopNum}, ${n})`);
				/* n の値によって resolve するか 再帰関数を呼び出すか が分かれる */
				if (n >= 10) { //nが10以上ならresolve
					resolve(n);
				} else {
					resolve(f(n + 1, loopNum + 1)); // n+1 を引数にした関数を再帰的に呼び出す
					/* 呼び出した先でresolveするには、resolve(関数) とする */
					/* 以下ダメな例。上の行の代わりに有効にして試してみるといい */
					// f(n + 1, loopNum)
				}
			}, 100);
		})
	}

	async function exe() {
		console.log("■1回目開始■");
		var result = await f(1);
		console.log("●●●result = ", result);
		console.log("■2回目開始■");
		result = await f(-7);
		console.log("●●●result = ", result);
	}
	exe();

	var data = {
		filepath: filepath,
		pageName: pageName,
		pageDetail: `
・1本道の再帰関数が全て完了するのを待つ処理
・f(1) ⇒ f(2) ⇒ ... ⇒ f(9) ⇒ f(10) + resolve()を返す
・resolve(関数) とすることで、resolve する権利を再帰関数に渡すイメージ
`,
	};
	res.render(`${filepath}/index`, data);
});

router.get('/b1', (req, res, next) => {
	var pageName = `枝分かれした再帰関数`
	console.log("----", pageName, "----");

	async function f(n, loopNum = 1) {
		return new Promise((resolve, reject) => {
			if (loopNum > 20) return; //無限ループを防ぐ
			if (n < 0) n = Math.abs(n);
			setTimeout(() => {
				if (n >= 10 || n == 0) { //nが10以上 or n=0 なら resolve
					console.log(`■resolve, (loopNum, n) = (${loopNum}, ${n})`);
					resolve();
				} else {  //  n*3, n+1 を引数にした2つの関数を再帰的に呼び出す
					console.log(`(${loopNum}, ${n})`);
					Promise.all([
						f(n * 3, loopNum + 1),
						f(n + 1, loopNum + 1)
					]).then((fa) => {
						resolve(`(loopNum, n) = (${loopNum}, ${n})`);
					})
				}
			}, 100);
		})
	}

	async function exe() {
		console.log("■1回目開始■");
		var result = await f(1);
		console.log("●●●result, ", result);
		console.log("■2回目開始■");
		result = await f(-9);
		console.log("●●●result, ", result);
	}
	exe();

	var data = {
		filepath: filepath,
		pageName: pageName,
		pageDetail: `
・枝分かれした再帰関数が全て完了するのを待つ処理
・f(1) ┳ f(2) ⇒ ... ⇒ f(9) ⇒ f(10) + resolve()を返す
       ┗ f(3) ┳ f(4) ⇒ ...
               ┗ f(9) ┳ f(10) + resolve()を返す 
                       ┗ f(27) + resolve()を返す
・全てのresolveが返るのを確認したのちに処理を進める
・Promise.all(関数) とすることで、resolve する権利を再帰関数に渡すイメージ
`,
	};
	res.render(`${filepath}/index`, data);
});

router.get('/b2', (req, res, next) => {
	var pageName = `枝分かれした再帰関数(コールバック使用)`
	console.log("----", pageName, "----");

	async function callback(n, loopNum) {
		return new Promise((resolve, reject) => {
			console.log(`■callback, (loopNum, n) = (${loopNum}, ${n})`);
			resolve(`(loopNum, n) = (${loopNum}, ${n})`);
		});
	}

	async function f(n, loopNum = 1, cb = callback) {
		return new Promise((resolve, reject) => {
			if (loopNum > 13) return; //無限ループを防ぐ
			if (n < 0) n = Math.abs(n); //負の数が来ると処理数が激増するので
			setTimeout(() => {
				if (n >= 10 || n == 0) { //nが10以上 or n=0 なら コールバック関数
					resolve(cb(n, loopNum));
				} else {  //  n*3, n+1 を引数にした2つの関数を再帰的に呼び出す
					console.log(`(${loopNum}, ${n})`);
					Promise.all([f(n * 3, loopNum + 1), f(n + 1, loopNum + 1)]).then((fa) => {
						resolve(`(loopNum, n) = (${loopNum}, ${n})`);
					})
				}
			}, 100);
		})
	}

	async function exe() {
		console.log("■1回目開始■");
		var result = await f(1);
		console.log("●●●result, ", result);
		console.log("■2回目開始■");
		result = await f(-9);
		console.log("●●●result, ", result);
	}
	exe();

	var data = {
		filepath: filepath,
		pageName: pageName,
		pageDetail: `
・枝分かれした再帰関数が全て完了するのを待つ処理
・f(1) ┳ f(2) ⇒ ... ⇒ f(9) ⇒ f(10) + resolve()を返す
       ┗ f(3) ┳ f(4) ⇒ ...
               ┗ f(9) ┳ f(10) + resolve()を返す 
                       ┗ f(27) + resolve()を返す
・全てのresolveが返るのを確認したのちに処理を進める
・コールバックを使用する場合は、CB関数もpromiseにし、resolve(CB関数)とする
`,
	};
	res.render(`${filepath}/index`, data);
});

router.get('/z1', (req, res, next) => {
	var pageName = `フィボナッチ数列1`
	console.log("----", pageName, "----");
	var ansObj = { 1: 1, 2: 1 };

	async function f(n) {
		return new Promise((resolve, reject) => {
			if ([1, 2].includes(n)) {
				resolve(1);
			} else if (n in ansObj) {
				console.log("既に計算済みのf(n)です, n =", n);
				resolve(ansObj[n]);
			} else {
				Promise.all([f(n - 1), f(n - 2)]).then((fa) => {
					var answer = fa[0] + fa[1];
					ansObj[n] = answer;
					resolve(answer);
				})
			}
		})
	}

	async function exe() {
		console.log("■1回目開始■");
		var result = await f(10);
		console.log("●●●result = ", result);
		console.log("■2回目開始■");
		result = await f(12);
		console.log("●●●result = ", result);
		console.log(ansObj);
	}
	exe();

	var data = {
		filepath: filepath,
		pageName: pageName,
		pageDetail: `
・フィボナッチ数列を上から計算したもの
・f(10)を知りたい ⇒ f(9), f(8) を知りたい ⇒ ... ⇒ f(1), f(2) から f(3)を計算した ⇒ f(4)が分かる ⇒ ... ⇒ f(10)が分かる
・処理に無駄が多いので実用的ではない
・resolveを受け渡さず、
`,
	};
	res.render(`${filepath}/index`, data);
});

router.get('/z2', (req, res, next) => {
	var pageName = `フィボナッチ数列2`
	console.log("----", pageName, "----");
	console.log("フィボナッチ数列(その２)------------");
	var ansObj = { 1: 1, 2: 1 };

	async function f(n, a1 = 0, a2 = 1, i = 2) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				i++;
				var a3 = a1 + a2;
				console.log(`(n, i, a3) = (${n}, ${i}, ${a3})`)
				if (i >= n) {
					resolve(a3);
				} else {
					resolve(f(n, a2, a3, i));
				}
			}, 500);
		})
	}

	async function exe() {
		console.log("■1回目開始■");
		var result = await f(10);
		console.log("●●●result = ", result);
		console.log("■2回目開始■");
		result = await f(12, 4, 6);
		console.log("●●●result = ", result);
	}
	exe();

	console.log("■■■async関数外■■■");

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

router.get('/z3', (req, res, next) => {
	var pageName = `フィボナッチ数列3`
	console.log("----", pageName, "----");
	console.log("フィボナッチ数列(その3)------------");
	var ansObj = { 1: 1, 2: 1 };
	var a1 = 0, a2 = 1, i = 2;

	async function f(n, a1, a2, cb) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				i++;
				var a3 = a1 + a2;
				console.log(`(n, i, a3) = (${n}, ${i}, ${a3})`)
				if (i >= n) {
					// resolve(a3);
					resolve(cb(a3));
				} else {
					resolve(f(n, a2, a3, cb));
				}
			}, 500);
		})
	}

	async function cb(answer) {
		return new Promise((resolve, reject) => {
			console.log("answer = ", answer);
			resolve("resolved");
		});
	}

	async function exe() {
		console.log("■1回目開始■");
		var result = await f(7, 0, 1, cb);
		console.log("●●●result = ", result);
		// console.log("2回目開始");
		// result = await f(12, cb(answer));
		// console.log("●●●result = ", result);
	}
	exe();

	console.log("■■■async関数外■■■");

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

router.get('/zz1', (req, res, next) => {
	var pageName = `コラッツ予想`
	console.log("----", pageName, "----");
	var i = 0;

	async function f(tryNum, n, cb) {
		return new Promise((resolve, reject) => {
			i++;
			if (i > tryNum) {
				return;
			}
			setTimeout(() => {
				console.log("---------------");
				if (n >= 4) { resolve(n); return; }
				// resolve(`n = ${n}`);
				if ((n - 1) % 3 == 0 && (n - 1) % 2 == 1) {
					var n2 = (n - 1) / 3;
					console.log("n2 = ", n2);
					// resolve(n2);
					// f(tryNum, n2, cb);
					resolve(f(tryNum, n2, cb));
				} else {
					var n1 = n * 2
					console.log(n1);
					// f(tryNum, n1, cb);
					resolve(f(tryNum, n1, cb));

					if (n1 >= 15) {
						console.log("answer = ", n1);
						// resolve(n1);
					}
				}
			}, 100);
		})
	}

	async function cb(answer) {
		return new Promise((resolve, reject) => {
			console.log("cb = ", answer);

			resolve(answer);
		});
	}

	async function exe() {
		console.log("■1回目開始■");
		var result = await f(10, 1, cb);
		console.log("●●●result = ", result);
		// console.log("2回目開始");
		// result = await f(12, cb(answer));
		// console.log("result = ", result);
	}
	exe();

	console.log("■■■async関数外■■■");

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