/* bookshelf（データベース操作）の設定 */
knex = require('knex')({//npm install knex@^0.14.6
	dialect: 'mysql',
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		charset: 'utf8'
	}
});
Bookshelf = require('bookshelf')(knex);//npm install bookshelf
//Bookshelfをグローバル変数にすることで、他の.jsファイルでもBookshelfを使用できるようにしている

/* mysql（データベース）の設定 */
var mysql = require("mysql");
connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	charset: 'utf8',
	multipleStatements: true         //一度に複数のクエリを実行できる
});
connection.connect((err) => {     //データベースへの接続の成否を表示
	if (err) {
		console.log('error connecting: ' + err.stack);
		return;
	};
});

const express = require('express');
const router = express.Router();
module.exports = router;