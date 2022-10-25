var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {
    title: 'ペイパル',
    client_id: process.env.CLIENT_ID,
    secret: process.env.SECRET_KEY,
  }
  res.render('web-payment-standard', data);
});

router.get('/success/', async (req, res, next) => {
  console.log("================================== success");
  res.send('Success <a href="/web-payment-standard/">トップに戻る</a>');
  // res.redirect(`/`)
});

router.get('/error/', async (req, res, next) => {
  console.log("================================== error");
  res.send('error <a href="/web-payment-standard/">トップに戻る</a>');
  // res.redirect(`/`)
});

module.exports = router;