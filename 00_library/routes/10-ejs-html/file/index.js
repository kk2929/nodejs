const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(routespath, __dirname);

router.get('/', (req, res, next) => {
  res.render(`${filepath}/index`);
});

module.exports = router;
