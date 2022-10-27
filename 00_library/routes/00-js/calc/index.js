const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname);

router.get('/', async (req, res, next) => {

	/* コンビネーション */
	// nums = ["a", "b", "c"]
	// k = 2
	// return : ["ab", "ac", "bc"]
	var combination = (nums, k) => {
		let ans = [];
		if (nums.length < k) return []

		if (k == 1) {
			for (let i = 0; i < nums.length; i++) {
				ans[i] = nums[i];
			}
		} else {
			for (let i = 0; i < nums.length - k + 1; i++) {
				let row = combination(nums.slice(i + 1), k - 1);
				for (let j = 0; j < row.length; j++) {
					ans.push(nums[i] + row[j]);
				}
			}
		}
		return ans;
	}

	/* コンビネーション */
	// nums = [1, 2, 3]
	// k = 2
	// return : [[1, 2], [1, 3], ...]
	async function combination_arr(nums, k) {
		var ans = [];

		if (nums.length < k) return []

		if (k == 1) {
			for (let i = 0; i < nums.length; i++) {
				ans[i] = [nums[i]];
			}
		} else {
			for (let i = 0; i < nums.length - k + 1; i++) {
				var row = await combination_arr(nums.slice(i + 1), k - 1);
				for (let j = 0; j < row.length; j++) {
					ans.push([nums[i], ...row[j]]);
				}
			}
		}
		return ans;
	}

	/* 関数 */
	var seed = "asdf";
	var n = 16;
	var ansObj = { "4": 12345 };
	console.log("ansObj = ", ansObj)

	f(n).then((a) => {
		console.log("ansObj = ", ansObj)
		console.log('f(n) = ', a);
		res.redirect('/manage/');
	})
	//askServer(n)
	function f(n) {
		return new Promise((resolve, reject) => {
			console.log("ansObj = ", ansObj)
			console.log('--------n =', n);

			if (n == 0) {
				resolve(1);
			} else if (n == 2) {
				resolve(2);
			} else if (n in ansObj) {
				console.log("既に計算済みのf(n)です, n =", n);
				resolve(ansObj[n]);
			} else if (n % 2 == 0) {
				Promise.all([f(n - 1), f(n - 2), f(n - 3), f(n - 4)]).then((fa) => {
					var a = fa[0] + fa[1] + fa[2] + fa[3];
					console.log(`(n, a) = (${n}, ${a})`)
					ansObj[n] = a;
					resolve(a);
				})
			} else {
				g(n).then((a) => {
					ansObj[n] = a;
					resolve(a);
				})
			}

		})
	}

	function g(n) {
		return new Promise((resolve, reject) => {
			console.log(`g(${n})`);
			resolve(1000);
		})
	}
	// res.render(`${filepath}/index`);
});

module.exports = router;
