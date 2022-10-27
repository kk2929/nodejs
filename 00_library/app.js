require("dotenv").config(); //npm install dotenv // .envファイルを使用するために必要
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require("fs")

var validator = require("express-validator");	//npm i express-validator@5.3.1
/* validator：入力値のチェックを行う
・このバージョンでは app.use(validator()); する必要があるが、最新バージョンでは使い方が全く違うので注意すること
・login/index で使用している
*/
var session = require("express-session");	//npm i express-session

/* ページの設定 */
var database = require("./routes/database");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

console.log(__dirname); //ディレクトリ名を表示。teraterm上でログ確認時に、どのプログラムが動いているかが分かりやすくするために必要

var cors = require('cors'); //npm install cors
app.use(cors()); //クロスドメインエラー対策
// file/uploadで使用している

var multipart = require('connect-multiparty'); //npm install connect-multiparty
app.use(multipart());//formで　enctype="multipart/form-data"　を使用するのに必要(ファイル添付)
// mail/indexで使用
//    …これを使用するとreqの構造が大幅に変化するので注意
//    …例)ファイルの出力が、 req.file ⇒ req.files.フォームのname属性名

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());	//express-validatorを使用するのに必要

/* express-session の設定 */
var session_opt = {
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: null },
};
app.use(session(session_opt));

/* 自動で./routes フォルダの構造を取得・ルーティングをする */
// var dir = './routes';
// async function walk(p, fileCallback, errCallback) {
// 	return new Promise((resolve, reject) => {
// 		fs.readdir(p, function (err, files) {
// 			if (err) {
// 				errCallback(err);
// 				return;
// 			}
// 			// console.log(files);
// 			files.forEach(function (f) {
// 				var fp = path.join(p, f); // to full-path
// 				if (fs.statSync(fp).isDirectory()) {
// 					// walk(fp, fileCallback);// ディレクトリなら再帰
// 					resolve(walk(fp, fileCallback));// ディレクトリなら再帰
// 				} else {
// 					// fileCallback(fp); // ファイルならコールバックで通知
// 					resolve(fileCallback(fp)); // ファイルならコールバックで通知
// 				}
// 			});
// 		});
// 	});
// };
// async function exec() {
// 	var result = await walk(dir, async function (path) {
// 		return new Promise((resolve, reject) => {
// 			var p = path.replace(/\\/g, "/").split('.')[0];
// 			// console.log(p);
// 			var pp = p.replace(/^.*?\//, "");
// 			// console.log(pp);
// 			app.use(`/${pp}`, require(`./${p}`));
// 			console.log(`/${pp}`);
// 			resolve("llllllllllllllllllllllllllllllllll");
// 			if (pp == "exam/template/index") {
// 				console.log("あ");
// 			}
// 		});
// 	}, async function (err) {
// 		console.log("Receive err:" + err);
// 	})
// 	console.log(result);
// 	console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
// }
// exec();

/* ルーティング */
app.use("/90-advanced/login/member/*", require("./routes/member.js")());	//ログインページの設定。階層が下のルーティングよりも先に書く
const route = [
	["00-js", [
		["calc",
			["index"]],
		["tips",
			["index"]],
	]],
	["10-ejs-html", [
		["file",
			["index", "upload"]],
		["memo",
			["index"]],
	]],
	["20-db", [
		["mysql-crud",
			["index", "create", "edit"]],
		["mysql-crud2",
			["index", "create", "edit"]],
		["mysql-crud3",
			["index", "index2", "create", "edit"]],
		["oracle-crud",
			["index", "create", "edit"]],
	]],
	["50-aws", [
		["s3-upload",
			["index"]],
	]],
	["80-css", [
		["position",
			["index"]],
		["practical",
			["index"]],
	]],
	["90-advanced", [
		["excel",
			["index"]],
		["login",
			["index", "logout", "member/logind"]],
		["mail",
			["index"]],
	]],
	["99-etc", [
		["template",
			["index", "page2"]],
		["async",
			["index"]],
		["bool-check",
			["index"]],
		["AtCorder",
			["index"]],
	]],
]
for (let i = 0; i < route.length; i++) {
	const route1 = route[i][0];
	var route2ary = route[i][1];
	for (let i = 0; i < route2ary.length; i++) {
		const route2 = route2ary[i][0];
		var route3ary = route2ary[i][1];
		for (let i = 0; i < route3ary.length; i++) {
			const route3 = route3ary[i];
			app.use(`/${route1}/${route2}/${route3}`, require(`./routes/${route1}/${route2}/${route3}`));
		}
	}
}
app.use("/database", database);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;