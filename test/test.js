const router = require('../app');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.config.includeStack = true;
chai.use(chaiAsPromised);

const createShipment = require('../app/canada-post-api/create-ncs');

/** FIND NESTED VALUE **/
const getNestedValue = require('../app/canada-post-api/get-artifact').getNestedValue;
describe("When find nested value", function() {
  it("object should contains val", function() {
    const obj = [{a: 4, b:5, c:6}, {a:7, b:8, c:9}];
    chai.expect(getNestedValue(obj, 7)).to.deep.equal({a:7, b:8, c:9});
  })

  it("object should not contains val", function() {
    const obj = [{a:4, b:5, c:6}, {d:7, c:8, e:9}];
    chai.expect(getNestedValue(obj, 11)).to.deep.equal(null);
  })
})

/** READ XML FILE **/
const readXml = createShipment.readXml;
describe("When reading xml file", function() {
  it("should return correct xml format", function() {
    readXml('./request-body.xml').then((data) => {console.log(data)});
  })
})

/** REQUEST JSON FROM API **/
const postWith = createShipment.with;
const postOptions = createShipment.postOptions;
describe("When request json from Canada Post API", function() {
  it("should contains correct field", function() {
    chai.expect(postWith('./request-body.xml')).to.eventually.have.own.property('non-contract-shipment-info');
  })
})
