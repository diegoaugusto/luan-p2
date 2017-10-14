var express = require('express');
var visionAPI = require('../services/visionApiWrapper');
var storageAPI = require('../services/storageWrapper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("\n\nComeçando o processamento: " + new Date());
  const bucketName = "luan-project";
  const options = {
    prefix: "Alphaville_Run/",
  };

  // storageAPI.getFiles(bucketName, options, (bucketFiles) => {
  //   //console.log(JSON.stringify(bucketFiles));
  //   res.json(bucketFiles);
  // });

  storageAPI.getFiles(bucketName, options).then((bucketFiles) => {
    //console.log(JSON.stringify(bucketFiles));
    var proms = new Array();
    var files = new Array();
    bucketFiles.forEach(bucketFile => {
      var prom = visionAPI.textDetection(bucketName, bucketFile.name);
      proms.push(prom);
      // files.push({name:bucketFile.name, labels:[]});

      // visionAPI.textDetection(bucketName, bucketFile.name)
      //   .then((result) => {
      //     var tokens = result.tokens;
      //     // for (var i = 0; i < tokens.length; i++) {
      //     //   console.log(i + "\t" + tokens[i]);
      //     // }
      //     files.push(result);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    });

    proms.splice(0, 1);
    Promise.all(proms)
      .then(results => {
        for (var i = 0; i < results.length; i++) {
          //console.log(i + "\t" + JSON.stringify(results[i]));
          files.push(results[i]);
        }

        console.log("\n\nFinalizando o processamento: " + new Date());
        res.json(results);
      })
      .catch(err => {
        console.log(err);
      });

  });

  //visionAPI.textDetection();
  //res.send('photos');
});

module.exports = router;
