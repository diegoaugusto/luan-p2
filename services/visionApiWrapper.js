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
  }
}

module.exports = visionAPI;
