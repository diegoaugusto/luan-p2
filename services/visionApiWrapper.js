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
  textDetection : function() {
    // Prepare the request object
    const request = {
      source: {
        filename: fileName
      }
    };

    Vision.textDetection(request)
      .then((results) => {
        const labels = results[0].textAnnotations;

        console.log('Text:');
        labels.forEach((label) => console.log(label.description));
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
  }
}

module.exports = visionAPI;
