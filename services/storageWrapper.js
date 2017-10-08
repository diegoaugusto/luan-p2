var fs = require('fs');
var obj = JSON.parse(fs.readFileSync("./config/storageCredentials.json", 'utf8'));

// [START storage_list_buckets]
// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage')(obj);


var storageAPI = {
  listBuckets: function() {
    // Lists all buckets in the current project
    Storage
      .getBuckets()
      .then(results => {
        const buckets = results[0];

        console.log('Buckets:');
        buckets.forEach(bucket => {
          console.log(bucket.name);
        });
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  },

  getFiles: function(bucketName, options, callback) {
    return Storage.bucket(bucketName).getFiles(options)
      .then(results => {
        var bucketFiles = new Array();
        const files = results[0];
        const signedUrlOptions = {
          action: 'read',
          expires: '03-17-2025',
        };

        files.forEach(file => {
          var bucketFile = {};

          // const metadata = file.metadata;
          // console.log(`\n\n\nFile: ${metadata.name}`);
          // console.log(`Bucket: ${metadata.bucket}`);
          // console.log(`Storage class: ${metadata.storageClass}`);
          // console.log(`Self link: ${metadata.selfLink}`);
          // console.log(`ID: ${metadata.id}`);
          // console.log(`Size: ${metadata.size}`);
          // console.log(`Updated: ${metadata.updated}`);
          // console.log(`Generation: ${metadata.generation}`);
          // console.log(`Metageneration: ${metadata.metageneration}`);
          // console.log(`Etag: ${metadata.etag}`);
          // console.log(`Owner: ${metadata.owner}`);
          // console.log(`Component count: ${metadata.component_count}`);
          // console.log(`Crc32c: ${metadata.crc32c}`);
          // console.log(`md5Hash: ${metadata.md5Hash}`);
          // console.log(`Cache-control: ${metadata.cacheControl}`);
          // console.log(`Content-type: ${metadata.contentType}`);
          // console.log(`Content-disposition: ${metadata.contentDisposition}`);
          // console.log(`Content-encoding: ${metadata.contentEncoding}`);
          // console.log(`Content-language: ${metadata.contentLanguage}`);
          // console.log(`Metadata: ${metadata.metadata}`);
          // console.log(`Media link: ${metadata.mediaLink}`);


          bucketFile.name = file.name;
          bucketFile.metadata = file.metadata;

          bucketFile.url = file.getSignedUrl(signedUrlOptions).then(results => {
            const url = results[0];
            return Promise.resolve(url);
          })
          .catch(err => {
            console.error('ERROR:', err);
            return undefined;
          });

          bucketFiles.push(bucketFile);
        });

        //console.log(JSON.stringify(bucketFiles));
        return callback(bucketFiles);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  }
}

module.exports = storageAPI;
