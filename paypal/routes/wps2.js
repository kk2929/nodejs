var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {
    title: 'ペイパル',
    client_id: process.env.CLIENT_ID,
    secret: process.env.SECRET_KEY,
  }
  res.render('wps2', data);
});

router.post('/create', async (req, res, next) => {
  var order = {
    intent: 'CAPTURE',
    application_context: {
      brand_name: "フォトン算数クラブ",
      shipping_preference: "NO_SHIPPING",	//これがあると、ペイパルアカウントの履歴に住所が記録されない
    },
    payer: {
      name: {
        given_name: "タロウ",
        surname: "タナカ"
      },
      address: {
        address_line_1: '1-2-3',
        address_line_2: '',
        admin_area_2: '〇〇区〇〇町',
        admin_area_1: '東京都',
        postal_code: '123-4567',
        country_code: 'JP'
      },
      email_address: "buyer@example.com",
      phone: {
        phone_type: "MOBILE",
        phone_number: {
          national_number: "819034567890"
        }
      }
    },
    purchase_units: [{
      amount: {
        currency_code: "JPY",
        value: '100'
      },
    }],
    invoice_id: 111,
    custom_id: 222
  }

  res.status(200).send(order);
});

router.get('/success/', async (req, res, next) => {
  console.log("================================== success");
  res.send('Success <a href="/wps2/">トップに戻る</a>');
  // res.redirect(`/`)
});

router.get('/error/', async (req, res, next) => {
  console.log("================================== error");
  res.send('error <a href="/wps2/">トップに戻る</a>');
  // res.redirect(`/`)
});

module.exports = router;