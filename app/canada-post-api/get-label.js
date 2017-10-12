const request = require('request');
const config = require('./config');

/** GET PDF FILE OF LABEL FROM CANADA-POST API **/
const getNCSFrom = (json) => {

  const links = json['non-contract-shipment-info']['links']['link'];
  const url = getNestedValue(links, 'label')['href']; // url of the non-contract shipment created
  const type = getNestedValue(links, 'label')['media-type']; // type of the label file, e.g: pdf
  const id = json['non-contract-shipment-info']['shipment-id'];

  const getOptions = {
    url : url,
    headers: {
      'Accept' : type,
      'Authorization' : "Basic " + new Buffer(config.username + ":" + config.password).toString("base64")
    },
    encoding: null // Enable returning binary data
  }

  console.log("GETTING Artifact " + id + " from URL: " + url);

  return new Promise( (resolve, reject) => {
    // GET PDF file from Canada Post API
    request.get(getOptions, (e, r, b) => {
      if(e) return reject(e);
      return resolve({id: id, pdf: b});
    })
  });
}

/** SUPPORT FUNCTIONS TO READ 'LABEL' FIELD IN THE RESPONSE **/
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
