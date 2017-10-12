const request = require('request');
const fs = require('fs');
const parser = require('xml2json');
const config = require('./config');

const postOptions = {
  url: 'https://ct.soa-gw.canadapost.ca/rs/'+config.customerNumber+'/ncshipment',
  headers: {
    'Content-Type' : 'application/vnd.cpc.ncshipment-v4+xml',
    'Accept' : 'application/vnd.cpc.ncshipment-v4+xml',
    "Authorization" : "Basic " + new Buffer(config.username + ":" + config.password).toString("base64")
  },
};

const readXml = (xmlFile) => new Promise( (resolve, reject) => {
  fs.readFile('./request-body.xml', 'utf8', function(err, data) {
    if(err) return reject(err);
    return resolve(data.toString());
  })
});

/** POST WITH DEFINED REQUEST **/
const postWith = (xmlFile) => {
  return readXml(xmlFile)
    .then((xmlBody) => new Promise( (resolve, reject) => {

      postOptions.body = xmlBody;

      // Request to Canada Post Endpoint, Receive XML in response
      request.post(postOptions, (e, r, b) => {
        if(e) return reject(e);

        try{
          // Convert XML to JSON
          const json = parser.toJson(b, config.parserOptions);
          console.log("New NCS JSON: " + JSON.stringify(json, 0, 2));
          return resolve(json);
        } catch(err) {
          reject(err)
        }
      });

    }))
    .catch(
      (err) => {console.log("ReadXML Error: " + err)}
    );
};

module.exports.with = postWith;
module.exports.readXml = readXml;
