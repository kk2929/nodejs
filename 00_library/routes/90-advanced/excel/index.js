const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");
const dateUtils = require("date-utils"); //npm install date-utils。日付の表示に関するモジュール

const Testlog = Bookshelf.Model.extend({
	tableName: 'testlog',
	hasTimestamps: true,//テーブルのカラムにcreated_atやupdated_atがある時のみ使用する
});

router.get('/', (req, res, next) => {
	var sqlTex = `
		SELECT *
		FROM testlog
		ORDER BY student_id, course_id, created_at
		;`
	connection.query(sqlTex, (error, results) => {
		var data = {
			filepath: filepath,
			pageName: "全てのデータ",
			pageDetail: `
				・testlogテーブルの全てのデータを表示します<br>
				・表示順：生徒ID,単元ID,回答日時(昇順)
				`,
			data: results,
			dateUtils: dateUtils,
			ejsName: "alldata",
		};
		res.render(`${filepath}/index`, data);
	})
});

router.get('/student/', (req, res, next) => {
	var sqlTex = `
		SELECT *,
			COUNT(DISTINCT(course_id)) AS test_co,
			COUNT(operation = "c" OR NULL) AS q_co,
			COUNT((operation = "c" AND result = 1) OR NULL) AS o_co,
			COUNT((operation = "ce" AND result = 0) OR NULL) AS failure_co
		FROM testlog
		GROUP BY student_id
		;`
	connection.query(sqlTex, (error, results) => {
		var data = {
			filepath: filepath,
			pageName: "生徒ごと",
			pageDetail: `
				・生徒IDでグループ化<br>
				・表示順：生徒ID
				`,
			data: results,
			dateUtils: dateUtils,
			ejsName: "student",
		};
		res.render(`${filepath}/index`, data);
	})
});

router.get('/student/:student_id/', (req, res, next) => {
	var student_id = req.params.student_id;
	var sqlTex = `
		SELECT *,
			COUNT(operation = "c" OR NULL) AS q_co,
			COUNT((operation = "c" AND result = 1) OR NULL) AS o_co,
			COUNT((operation = "ce" AND result = 0) OR NULL) AS failure_co
		FROM testlog
		WHERE student_id = ${student_id}
		GROUP BY course_id
		ORDER BY course_id 
		;`
	connection.query(sqlTex, (error, results) => {
		var data = {
			filepath: filepath,
			pageName: `生徒ごと ＞ 生徒ID = ${student_id}`,
			pageDetail: `
				・特定生徒,単元IDでグループ化<br>
				・表示順：単元ID
				`,
			data: results,
			dateUtils: dateUtils,
			ejsName: "student_id",
		};
		res.render(`${filepath}/index`, data);
	})
});

router.get('/student/:student_id/:course_id/', (req, res, next) => {
	var student_id = req.params.student_id;
	var course_id = req.params.course_id;
	var sqlTex = `
		SELECT *
		FROM testlog
		WHERE student_id = ${student_id}
			AND course_id = ${course_id}
			AND operation IN("cs", "ce", "c", "rfinish", "t", "ws", "w")
		ORDER BY created_at DESC
		;
		CALL testlog_c_scoring(${student_id}, ${course_id})
		;
		SELECT * FROM tmp
		;`
	connection.query(sqlTex, (error, results) => {
		if (error) return res.redirect(`../`), console.log(error)
		var data = {
			filepath: filepath,
			pageName: `生徒ごと ＞ 生徒ID = ${student_id} ＞ 単元ID = ${course_id}`,
			pageDetail: `
				・特定生徒,特定単元の確認テストログ<br>
				・表示順：日時(降順)
				`,
			data: results[0],
			data2: results[1],
			dateUtils: dateUtils,
			ejsName: "student_id_course",
			operationList: [
				{ symbol: "cs", mean: '開始' },
				{ symbol: "c", mean: '問題' },
				{ symbol: "ce", mean: '終了' },
			],
		};
		console.log(results[1][0]);
		console.log(results[2]);
		res.render(`${filepath}/index`, data);
	})
});

module.exports = router;
