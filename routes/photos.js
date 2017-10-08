var express = require('express');
var visionAPI = require('../services/visionApiWrapper');
var storageAPI = require('../services/storageWrapper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const bucketName = "luan-project";
  const options = {
    prefix: "Alphaville_Run",
  };

  storageAPI.getFiles(bucketName, options, (bucketFiles) => {
    //console.log(JSON.stringify(bucketFiles));
    res.json(bucketFiles);
  });


  //visionAPI.textDetection();
  //res.send('photos');
});

module.exports = router;
