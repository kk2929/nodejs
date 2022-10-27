/* クッキーに関する関数まとめ */
/* クッキーのやり取り(1ページの最大表示件数) */
exports.rowLimit = function (req, res) {
	var rowLimit;
	if (req.body.rowLimit) {
		rowLimit = Number(req.body.rowLimit);
		res.cookie('rowLimit', rowLimit, { maxAge: 1000 * 60 * 60 * 24 })
		console.log('use req.body, rowLimit =' + rowLimit);
	} else if (req.cookies.rowLimit) {
		rowLimit = Number(req.cookies.rowLimit);
		console.log('use cookie, rowLimit =' + rowLimit);
	} else {
		rowLimit = 20;
		res.cookie('rowLimit', rowLimit, { maxAge: 1000 * 60 * 60 * 24 })
		console.log('use default, rowLimit =' + rowLimit);
	};
	return rowLimit;
}

/* クッキーのやり取り(単元の絞り込み) */
exports.courseFilter = function (req, res) {
	var filterData = {};
	if (req.body.grade) filterData = req.body;
	else if (req.cookies.courseFilter) filterData = req.cookies.courseFilter;
	else { filterData = { grade: "all", }; };
	res.cookie('courseFilter', filterData, { maxAge: 1000 * 60 * 60 * 24 });
	return filterData;
}

/* クッキーのやり取り(生徒の絞り込み) */
exports.selectdata = function (req, res) {
	var selectdata = {};
	if (req.body.qsearch != undefined) {
		selectdata = req.body;
		if (req.body.qgrade != req.cookies.data.qgrade) {
			selectdata.qcourse = "all"
			console.log('--------grade changed--------');
		}
		res.cookie('data', selectdata, {
			maxAge: 1000 * 60 * 60 * 24,
		})
		console.log('--------1--------\n', 1);
	} else if (req.cookies.data != undefined) {
		selectdata = req.cookies.data;
		console.log('--------2--------\n', 2);
	} else {
		selectdata = {
			qsearch: "",
			qgrade: "all",
			qcourse: "all",
			qvalid: "all",
			qlog: "all",
		};
		res.cookie('data', selectdata, {
			maxAge: 1000 * 60 * 60 * 24,
		})
		console.log('--------3--------\n', 3);
	};
	return selectdata;
}