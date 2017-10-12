const request = require('request');
const express = require('express');
const router = express.Router();

const createShipment = require('../canada-post-api/create-ncs');
const xmlFile = './request-body.xml';

const getArtifact = require('../canada-post-api/get-artifact');

const fs = require('fs');


router.get('/', (req, res, next) => {
  createShipment.with(xmlFile)
    .then( (json) => getArtifact.from(json) )
    .catch( (err) => {console.log(err)})
    .then( (pdf) => {
      fs.writeFile("./tmp/label.pdf", pdf, "binary", function(err){console.log("Writting error:" + err)} );
      return res.status(200).json("DOWNLOADED");
    })
    .catch( (err) => {res.status(400).json(err)} )
});

module.exports = router;
