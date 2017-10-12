const request = require('request');
const express = require('express');
const router = express.Router();

const createShipment = require('../canada-post-api/create-ncs');

const getArtifact = require('../canada-post-api/get-artifact');

const fs = require('fs');


router.post('/', (req, res, next) => {
  const xmlFile = req.body;
  createShipment.with(xmlFile)
    .then( (json) => getArtifact.from(json) )
    .catch( (err) => { console.log("Get Artifact ERROR: " + err) })
    .then( (pdf) => {
      fs.writeFile("./tmp/label.pdf", pdf, "binary", function(err){ if(err) console.log("Writting ERROR:" + err) } );
      return res.status(200).send("Your shipping label is saved as ./tmp/label.pdf\n==========================\n");
    })
    .catch( (err) => {res.status(400).json(err)} )
});

router.get('/', (req, res, next) => {
  res.status(200).send('Hello, please run the following command to create a new non-contract shipment: <br><br>'+
                      '<i>curl -d "./request-body.xml" http://localhost:8080/</i>');
})

module.exports = router;
