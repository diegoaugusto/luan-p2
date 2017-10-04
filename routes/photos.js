var express = require('express');
var visionAPI = require('../services/visionApiWrapper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  visionAPI.textDetection();
  res.send('photos');
});

module.exports = router;
