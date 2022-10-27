exports.pageSize = function (req, res) {
	console.log('module');
	var pageSize;
	if (req.body.pageSize != undefined) {
		pageSize = Number(req.body.pageSize);
		res.cookie('pageSize', pageSize, {
			maxAge: 1000 * 60 * 60 * 24,
		})
		console.log('new pageSize =' + pageSize);
	} else if (req.cookies.pageSize != undefined) {
		pageSize = Number(req.cookies.pageSize);
		console.log('cookie pageSize =' + pageSize);
	} else {
		pageSize = 20;
		res.cookie('pageSize', pageSize, {
			maxAge: 1000 * 60 * 60 * 24,
		})
		console.log('default pageSize =' + pageSize);
	};
	return pageSize;
}

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