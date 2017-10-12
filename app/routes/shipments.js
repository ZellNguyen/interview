const request = require('request');
const express = require('express');
const router = express.Router();

const createShipment = require('../canada-post-api/create-ncs');
const getLabel = require('../canada-post-api/get-label');

const fs = require('fs');

const errorHandler = require('../api-logger');

router.post('/', (req, res, next) => {
  const xmlFile = req.body;
  createShipment.with(xmlFile)
    .catch( (err) => { errorHandler(err, res, 400); } ) // Handling Create new Non-contract shipment ERROR
    .then( (json) => getLabel.from(json) )
    .catch( (err) => { errorHandler(err, res, 500); } ) // Handling Get Artifact ERROR
    .then( ( artifact ) => {
      const fileName = "./tmp/label-" + artifact.id + ".pdf";
      fs.writeFile(fileName, artifact.pdf, "binary", function(err){
        if(err) errorHandler(err, res, 500);
        else {
          console.log("DONE!");
          return res.status(200).send("Your shipping label is saved as ./tmp/label-" + artifact.id +
                                      ".pdf\n"+
                                      "==========================\n");
        }
      });
    })
});

router.get('/', (req, res, next) => {
  res.status(200).send('Hello, please run the following command to create a new non-contract shipment: <br><br>'+
                      '<i>curl -d "./request-body.xml" http://localhost:8080/</i>');
})

module.exports = router;
