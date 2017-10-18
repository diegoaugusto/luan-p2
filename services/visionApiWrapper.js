var fs = require('fs');
var obj = JSON.parse(fs.readFileSync("./config/vapiCredentials.json", 'utf8'));

// Imports the Google Cloud client library
//const Vision = require('@google-cloud/vision')(obj);
const Vision = require('@google-cloud/vision')(obj);

// Instantiates a client
//const vApi = Vision();

// The name of the image file to annotate
const fileName = './public/images/runners.jpg';

var visionAPI = {
  // Performs label detection on the image file
  textDetection : function(bucketName, fileName) {
    // Prepare the request object
    const request = {
      source: {
        //filename: fileName
        gcsImageUri: `gs://${bucketName}/${fileName}`,
        //imageUri: `gs://${bucketName}/${fileName}`
      }
    };

    return Vision.textDetection(request)
      .then((results) => {
        const labels = results[0].textAnnotations;
        var terms = new Array();
        //console.log('Text: ['+ fileName +']');
        for (var i = 1; i < labels.length; i++) {
          //console.log((i) + "\t" + labels[i].description);
          terms.push(labels[i].description);
        }

        var result = {name:fileName, tokens:terms};
        //console.log(JSON.stringify(result));
        return Promise.resolve(result);
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
  },


  textDetectionBatch : function(bucketName, fileNames) {
    //console.log(fileNames.length);
    // Make a call to the Vision API to detect text
    let requests = [];
    fileNames.forEach((filename) => {
      let request = {
        //image: {content: fs.readFileSync(filename).toString('base64')},
        image: {source: {gcsImageUri: `gs://${bucketName}/${filename}`}},
        features: {type: 'TEXT_DETECTION'}
      };
      requests.push(request);
    });
    return Vision.batchAnnotateImages({requests: requests})
        .then((results) => {
          let detections = results[0].responses;
          var textResponse = {};
          fileNames.forEach(function (filename, i) {
            var response = detections[i];

            if (response.textAnnotations.length) {
              //console.log("["+ i +"] -------- " + filename);
              var texts = response.textAnnotations;
              for (var j = 1; j < texts.length; j++) {
                var text = texts[j];
                //console.log(text.description || '');
              }
            } else {
              //console.log(filename + ' had no discernable text.');
            }
          });
        });
  }
}

module.exports = visionAPI;
