const request = require('request');
const express = require('express');
const router = express.Router();
const parser = require('xml2json');

const xmlBody = '<?xml version="1.0" encoding="UTF-8"?>'+
'<non-contract-shipment xmlns="http://www.canadapost.ca/ws/ncshipment-v4">'+
'<requested-shipping-point>H2B1A0</requested-shipping-point>'+
'<delivery-spec>'+
'<service-code>DOM.EP</service-code>'+
 		'<sender>'+
      '<company>Capsule Corp.</company>'+
      '<contact-phone>1 (613) 450-5345</contact-phone>'+
      '<address-details>'+
       				'<address-line-1>502 MAIN ST N</address-line-1>'+
              '<city>MONTREAL</city>'+
              '<prov-state>QC</prov-state>'+
              '<postal-zip-code>H2B1A0</postal-zip-code>'+
      '</address-details>'+
    '</sender>'+
    '<destination>'+
     			    '<name>John Doe</name>'+
              '<company>ACME Corp</company>'+
              '<address-details>'+
                '<address-line-1>123 Postal Drive</address-line-1>'+
                '<city>Ottawa</city>'+
                '<prov-state>ON</prov-state>'+
                '<country-code>CA</country-code>'+
                '<postal-zip-code>K1P5Z9</postal-zip-code>'+
              '</address-details>'+
      '</destination>'+
      '<options>'+
        '<option>'+
          '<option-code>DC</option-code>'+
        '</option>'+
      '</options>'+
      '<parcel-characteristics>'+
       			'<weight>15</weight>'+
            '<dimensions>'+
              '<length>1</length>'+
              '<width>1</width>'+
              '<height>1</height>'+
            '</dimensions>'+
      '</parcel-characteristics>'+
      '<preferences>'+
            '<show-packing-instructions>true</show-packing-instructions>'+
      '</preferences>'+
      '<references>'+
            '<cost-centre>ccent</cost-centre>'+
            '<customer-ref-1>custref1</customer-ref-1>'+
            '<customer-ref-2>custref2</customer-ref-2>'+
      '</references>'+
    '</delivery-spec></non-contract-shipment>';

const username = '7daa4d8817703f29';
const password = '9760c4a09b09ae96cc42e2';
const customerNumber = '0008627758';

const postOptions = {
  url: 'https://ct.soa-gw.canadapost.ca/rs/'+customerNumber+'/ncshipment',
  body: xmlBody,
  headers: {
    'Content-Type' : 'application/vnd.cpc.ncshipment-v4+xml',
    'Accept' : 'application/vnd.cpc.ncshipment-v4+xml',
    "Authorization" : "Basic " + new Buffer(username + ":" + password).toString("base64")
  }
}

const parserOptions = {
  object: true
}

const postNCS = (options) => new Promise( (resolve, reject) => {
  console.log(options.url);
  request.post(options, (e, r, b) => {
    if(e) return reject(e);

    try{
      return resolve(b);
    } catch(err) {
      reject(err)
    }

  });
})

const parseJson = (xml) => new Promise( (resolve, reject) => {
  try{
    const json = parser.toJson(xml, parserOptions);
    console.log(json);
    return resolve(json);
  } catch(err) {
    reject(err);
  }
})

const getNCS = (json) => new Promise( (resolve, reject) => {
  try {
    const href = json['non-contract-shipment-info']['links']['link'][4]['href'];
    const type = json['non-contract-shipment-info']['links']['link'][4]['media-type'];
    return resolve(href, type);
  } catch(err) {
    return reject(err);
  }
})

const getLabel = (url, type) => new Promise( (resolve, reject) => {
  console.log(type);
  const getOptions = {
    url : url,
    headers: {
      'Accept' : type,
      'Authorization' : "Basic " + new Buffer(username + ":" + password).toString("base64")
    }
  }

  request.get(getOptions, (e, r, b) => {
    if(e) return reject(e);

    try{
      return resolve(b);
    } catch(err) {
      reject(err)
    }
  })
})

router.get('/', (req, res, next) => {
  postNCS(postOptions)
    .then( (xml) => parseJson(xml))
    .then( (json) => getNCS(json) )
    .then( (url, type) => getLabel(url, type) )
    .catch( (err) => console.log(err) )
    .then( (pdf) => {
      return res.status(200).send(pdf);
    })
});

module.exports = router;
