const request = require('request');
const config = require('./config');

/** GET PDF FILE OF LABEL FROM CANADA-POST API **/
const getNCSFrom = (json) => {
  const links = json['non-contract-shipment-info']['links']['link'];
  const url = getNestedValue(links, 'label')['href']; // url of the non-contract shipment created
  const type = getNestedValue(links, 'label')['media-type']; // type of the label file, e.g: pdf

  const getOptions = {
    url : url,
    headers: {
      'Accept' : type,
      'Authorization' : "Basic " + new Buffer(config.username + ":" + config.password).toString("base64")
    },
    encoding: null // Enable returning binary data
  }

  console.log("Artifact URL: " + url);
  return new Promise( (resolve, reject) => {
    request.get(getOptions, (e, r, b) => {
      if(e) return reject(e);

      try{
        return resolve(b);
      } catch(err) {
        reject(err)
      }
    })
  });
}

/** SUPPORT FUNCTION TO READ 'LABEL' IN THE RESPONSE **/
function containsVal(json, findVal) {
  if(json == null) return false;

  var keys = Object.keys(json);

  for(const key of keys) {
    if(json[key] == findVal) return true;
  }
  return false;
};

function getNestedValue(arr, findVal) {
  for(const obj of arr) {
    if(containsVal(obj, findVal))
      return obj;
  }
  return null;
}

module.exports.getNestedValue = getNestedValue;
module.exports.from = getNCSFrom;
