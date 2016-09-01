var router = require('koa-router')();
var authorized = require('./authorize')

var config = require('../config');
var pending = require('../test-data/pending.json');
var settled = require('../test-data/settled.json');
var unauthorized = require('../test-data/unauthorized.json');
var wallet = require('../services/wallet')

function getUserWallet (userId) {
  return wallet.getWallet(userId)
}

router.post('/onboard-funds', function *(next) {
  var amount = this.headers['amount']
  var bearer = this.headers['authorization'];
  if (bearer === config.ContributorBearerToken) {
    yield wallet.updateWallet(49, amount, 'in')
    this.status = 200
  } else if (bearer === config.OwnerBearerToken) {
    yield wallet.updateWallet(78, amount, 'in')
    this.status = 200
  } else if (bearer === config.ManagerBearerToken) {
    yield wallet.updateWallet(9, amount, 'in')
    this.status = 200
  } else if (bearer === config.JessieBearerToken) {
    yield wallet.updateWallet(18, amount, 'in')
    this.status = 200
  } else if (bearer === config.CourtneyBearerToken) {
    yield wallet.updateWallet(27, amount, 'in')
    this.status = 200
  } else if (bearer === config.RobBearerToken) {
    yield wallet.updateWallet(35, amount, 'in')
    this.status = 200
  } else {
    this.status = config.unauthorized;
    this.body = unauthorized;
  }
});

module.exports = router;
