const request = require('request');
const fs = require('fs');
const parser = require('xml2json');
const config = require('./config.json');

// REQUEST: CREATE NEW NON-CONTRACT SHIPMENT
const postOptions = {
  url: 'https://ct.soa-gw.canadapost.ca/rs/'+config.customerNumber+'/ncshipment',
  headers: {
    'Content-Type' : 'application/vnd.cpc.ncshipment-v4+xml',
    'Accept' : 'application/vnd.cpc.ncshipment-v4+xml',
    "Authorization" : "Basic " + new Buffer(config.username + ":" + config.password).toString("base64")
  },
};

const readXml = (xmlFile) => new Promise( (resolve, reject) => {
  console.log("Reading XML file...");
  fs.readFile('./request-body.xml', 'utf8', function(err, data) {
    if(err) return reject(err);
    return resolve(data.toString());
  })
});

/** POST BY PASSING IN AN XML FILE **/
const postWith = (xmlFile) => {

  return readXml(xmlFile)
    .catch( (err) => {console.log("ReadXML Error: " + err)} )
    .then((xmlBody) => new Promise( (resolve, reject) => {
      console.log("Creating a non-contract shipment...");

      postOptions.body = xmlBody;
      // Request to Canada Post Endpoint, Receive XML in response
      request.post(postOptions, (e, r, b) => {
        if(e) return reject(e);

        try{
          // Convert XML to JSON
          console.log("Parsing the response to JSON format...");
          const json = parser.toJson(b, config.parserOptions);

          if(!json.hasOwnProperty("non-contract-shipment-info"))
            return reject("Invalid JSON: " + JSON.stringify(json,0,2)); // Invalid JSON Handler

          else {
            return resolve(json);
          }

        } catch(err) {
          reject(err)
        }
      });

    }));
};

module.exports.with = postWith;
module.exports.readXml = readXml;
