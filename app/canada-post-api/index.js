const canadaPostProvider = {
  createShipment : require('./create-ncs'),
  getLabel : require('./get-label')
}
module.exports = canadaPostProvider;
