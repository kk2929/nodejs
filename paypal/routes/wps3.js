// 参考
// https://qiita.com/PPJP/items/db5c57991c2c3fe80ac7#paypal%E6%B1%BA%E6%B8%88%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B
// https://developer.paypal.com/docs/api/orders/v2/


var express = require('express');
var router = express.Router();

// const request = require('request');
const axios = require('axios')

var client_id = process.env.CLIENT_ID
var secret = process.env.SECRET_KEY

router.get('/', function (req, res, next) {
  var data = {
    title: 'ペイパル',
    client_id: client_id,
    secret: secret,
  }
  res.render('wps3', data);
});

router.post('/create', async (req, res, next) => {
  console.log("=========== create");
  try {
    var URL = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
    var data = await axios.request({
      url: URL + "/?grant_type=client_credentials",
      method: "post",
      headers: {
        "Accept": "application/json",
        // "Accept-Language": "en_US"
      },
      auth: {
        username: client_id,
        password: secret
      },
    });
    var accessToken = data.data.access_token

    var URL = 'https://api-m.sandbox.paypal.com/v2/checkout/orders';
    var data = await axios.request({
      url: URL,
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        "intent": "CAPTURE",
        "application_context": {
          "brand_name": "社名",
          shipping_preference: "NO_SHIPPING",
        },
        "payer": {
          "name": {
            "given_name": "タロウ",
            "surname": "タナカ"
          },
          "address": {
            "address_line_1": "1-2-3",
            "address_line_2": "ペイパルビル 1001",
            "admin_area_2": "〇〇区〇〇",
            "admin_area_1": "東京都",
            "postal_code": "107-0001",
            "country_code": "JP"
          },
          "email_address": "buyer@example.com",
          phone: {
            phone_type: "MOBILE",
            phone_number: {
              national_number: "819034567890"
            }
          }
        },
        "purchase_units": [
          {
            "amount": {
              "currency_code": "JPY",
              "value": "60"
            }
          }
        ]
      }
    });
    console.log("id = ", data.data.id); //このIDは、売り手・買い手の明細の取引IDとは無関係の様子。

    res.status(200).send(data.data);
  }
  catch (err) {
    console.log("error ---------------------------");
    console.log(err.message);
    console.log(err.code);
    console.log(err.name);
  }
});

router.post('/capture', async (req, res, next) => {
  console.log("=========== capture");
  var accessToken = req.body.accessToken
  var orderID = req.body.orderID

  try {
    var URL = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;
    var data = await axios.request({
      url: URL,
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // 'PayPal-Request-Id': '7c3df866-90b7-4173-83e6-f2d2b53c8090', //一意である必要があるらしい。なくても動いた。
        // 'PayPal-Request-Id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      }
    });
    console.log("id = ", data.data.id); //このIDは、売り手・買い手の明細の取引IDとは無関係
    console.log("買い手 取引ID：", data.data.payer.payer_id); //買い手の明細の取引ID
    console.log("売り手 取引ID：", data.data.purchase_units[0].payments.captures[0].id); //売り手の明細の取引ID
    console.log("支払金額：", data.data.purchase_units[0].payments.captures[0].amount.value);

    res.status(200).send(data.data);
  }
  catch (err) {
    console.log("error ---------------------------");
    console.log(err.message);
    console.log(err.code);
    console.log(err.name);
    res.status(400).send(err);
  }
});

router.get('/success/', async (req, res, next) => {
  console.log("================================== success");
  res.send('Success <a href="/wps3/">トップに戻る</a>');
  // res.redirect(`/`)
});

router.get('/error/', async (req, res, next) => {
  console.log("================================== error");
  res.send('error <a href="/wps3/">トップに戻る</a>');
  // res.redirect(`/`)
});

module.exports = router;