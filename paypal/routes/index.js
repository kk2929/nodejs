// 参考
// https://github.com/bradtraversy/node_paypal_sdk_sample
// https://github.com/paypal/PayPal-node-SDK
// https://www.tabnine.com/code/javascript/modules/paypal-rest-sdk

var express = require('express');
var router = express.Router();

var client_id = process.env.CLIENT_ID
var secret = process.env.SECRET_KEY
	
var paypal = require('paypal-rest-sdk');
paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': client_id,
	'client_secret': secret,
});


router.get('/', function (req, res, next) {
	res.render('index', { title: 'ペイパル' });
});

router.post('/create', async (req, res, next) => {
	console.log("create");

	var create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://localhost:3000/success/",
			"cancel_url": "http://localhost:3000/cancel/"
		},
		"transactions": [{
			"item_list": {
				"items": [{
					"name": "item",
					"sku": "item",
					"price": "50",
					"currency": "JPY",
					"quantity": 1
				}]
			},
			"amount": {
				"currency": "JPY",
				"total": "50"
			},
			"description": "This is the payment description."
		}]
	};

	paypal.payment.create(create_payment_json, function (error, payment) {
		console.log("===================================");
		if (error) {
			res.send('Error-1 <a href="/">トップに戻る</a><br>' + error);
			// throw error;
		} else {
			console.log("Create Payment Response");
			console.log(payment);
			for (const e of payment.links) {
				if (e.rel == "approval_url") {
					res.redirect(e.href)
				}
			}
		}
	});
});

router.get('/success/', async (req, res, next) => {
	console.log("================================== success");
	var payerId = req.query.PayerID //大文字・小文字のミスに注意
	var paymentId = req.query.paymentId

	const execute_payment_json = {
		"payer_id": payerId,
		"transactions": [{
			"amount": {
				"currency": "JPY",
				"total": "50" //createと同額であること
				// "total": "5"
				// "total": "100"	//エラー
			}
		}]
	};
	paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
		if (error) {
			console.log(error.response);
			res.send('Error-2 <a href="/">トップに戻る</a><br>' + error);
			// throw error;
		} else {
			console.log(JSON.stringify(payment));
			res.send('Success <a href="/">トップに戻る（更新すると再度executeが走るので、本来はリダイレクトした方がいい）</a>');
			// res.redirect(`/`)
		}
	});
});

router.get('/cancel/', async (req, res, next) => {
	console.log("================================== cancel");
	res.send('Canceled <a href="/">トップに戻る</a>');
	// res.redirect(`/`)
});

module.exports = router;