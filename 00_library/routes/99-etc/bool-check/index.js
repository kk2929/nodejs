const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname).replace(/\\/g, "/");
const dateUtils = require("date-utils"); //npm install date-utils。日付の表示に関するモジュール

router.get('/', (req, res, next) => {
	var sqlTex = `
		SELECT *
		FROM test_table1
		;`
	connection.query(sqlTex, (error, results) => {
		console.log(error ? "エラー発生" : "エラーなし " + error);//false (null)

		console.log(1, results ? "true" : results); 				//true
		console.log(2, results[0] ? "true" : results[0]); 			//true
		console.log(3, results[-1] ? "true" : results[-1]); 		//false (undefined)
		console.log(4, results[999999] ? "true" : results[999999]); //false (undefined)
		console.log(5, results[0][0] ? "true" : results[0][0]);		//false (undefined)

		console.log(6, results.id ? "true" : results.id);			//false (undefined)
		console.log(7, results[0].id ? "true" : results[0].id);		//true
		// console.log(8, results[0][0].id ? "true" : "false");	//エラーになる。あえて外してログを確認してみよう
		/* ■理由
		results[0][0] は undefined 。undefined の id プロパティを参照しようとしたので、コンソールに
		> Cannot read property 'id' of undefined
		のエラーが出る。
		*/

		/* 以下のif文は、常にfalseなので絶対に実行されない */
		if (false) {
			console.log(8.1, results[0][0].id ? "true" : "false");//実行されない文中にエラーになるものが含まれていても実行できる
			あｄふぁふぁ//全角文字もOK
			// var //こういうのはダメ
		}

		var data = {
			filepath: filepath,
			pageName: `クエリ・bool値調査 > 全データ`,
			pageDetail: `
				・ページの説明文<br>
				・2行目
				`,
			data: results,
			data2: null,
			dateUtils: dateUtils,
		};
		res.render(`${filepath}/index`, data);
	})
});

router.get('/a/', (req, res, next) => {
	var sqlTex = `
		SELECT *
		FROM test_table1
		;
		SELECT *
		FROM employees
		;`
	connection.query(sqlTex, (error, results) => {
		console.log(error ? "エラー発生" : "エラーなし " + error);//false (null)

		console.log(1, results ? "true" : results); 						//true  
		console.log(2, results[0] ? "true" : results[0]); 					//true  (1番目のクエリのレコードの配列)
		console.log(3, results[0][0] ? "true" : results[0][0]);				//true  (1番目のクエリの1番目のレコードのオブジェクト)
		console.log(4, results[0][0].id ? "true" : results[0][0]);			//true  (1番目のクエリの1番目のレコードのid)
		console.log(5, results[1][999999] ? "true" : results[1][999999]);	//false (undefined)  (2番目のクエリの999999番目のレコード)
		// console.log(6, results[1][999999].id ? "true" : results[0][0]);	//エラー (2番目のクエリの999999番目のレコードのid)

		var data = {
			filepath: filepath,
			pageName: `クエリ・bool値調査 > クエリ2つ`,
			pageDetail: `
				・ページの説明文<br>
				・2行目
				`,
			data: results[0],	//1番目のクエリのレコードの配列
			data2: results[1],	//2番目のクエリのレコードの配列
			dateUtils: dateUtils,
		};
		res.render(`${filepath}/index`, data);
	})
});

router.get('/b/', (req, res, next) => {
	var sqlTex = `
		SELECT *
		FROM test_table1
		where id = -1.1
		;`
	connection.query(sqlTex, (error, results) => {
		console.log(error ? "エラー発生" : "エラーなし " + error);//false (null)

		console.log(1, results ? results : "false"); 				//true  ([]：空の配列)
		console.log(2, results[0] ? "true" : results[0]); 			//false (undefined)
		console.log(3, results[-1] ? "true" : results[-1]); 		//false (undefined)
		console.log(4, results[999999] ? "true" : results[999999]); //false (undefined)
		// console.log(5, results[0][0] ? "true" : results[0][0]);	//エラー

		console.log(6, results.id ? "true" : results.id);			//false (undefined)
		// console.log(7, results[0].id ? "true" : results[0].id);	//エラー

		var data = {
			filepath: filepath,
			pageName: `クエリ・bool値調査 > クエリ結果 0件`,
			pageDetail: `
				・ページの説明文<br>
				・2行目
				`,
			data: results,
			data2: null,
			dateUtils: dateUtils,
		};
		res.render(`${filepath}/index`, data);
	})
});

router.get('/c/', (req, res, next) => {
	var sqlTex = `
		SELECT *
		FROM aaaaaaaaaa
		;`
	connection.query(sqlTex, (error, results) => {
		console.log(error ? "エラー発生" : "エラーなし");//true

		console.log(1, results ? "true" : results); 				//false (undefined)
		// console.log(2, results[0] ? "true" : results[0]); 		//エラー
		// console.log(6, results.id ? "true" : results.id);		//エラー

		var data = {
			filepath: filepath,
			pageName: `クエリ・bool値調査 > 存在しないテーブルを参照`,
			pageDetail: `
				・ページの説明文<br>
				・2行目
				`,
			data: results,
			data2: null,
			dateUtils: dateUtils,
		};
		res.render(`${filepath}/index`, data);
	})
});

router.get('/d/', (req, res, next) => {
	var sqlTex = `
		FROM test_table1
		SELECT 
		where and 
		;`
	connection.query(sqlTex, (error, results) => {
		console.log(error ? "エラー発生" : "エラーなし");//true

		console.log(1, results ? "true" : results); 				//false (undefined)
		// console.log(2, results[0] ? "true" : results[0]); 		//エラー
		// console.log(6, results.id ? "true" : results.id);		//エラー

		var data = {
			filepath: filepath,
			pageName: `クエリ・bool値調査 > 構文ミス`,
			pageDetail: `
				・ページの説明文<br>
				・2行目
				`,
			data: results,
			data2: null,
			dateUtils: dateUtils,
		};
		res.render(`${filepath}/index`, data);
	})
});

module.exports = router;
