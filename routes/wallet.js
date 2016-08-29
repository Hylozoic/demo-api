var router = require('koa-router')();
var authorised = require('./authorise')

var config = require('../config');
var pending = require('../test-data/pending.json');
var settled = require('../test-data/settled.json');
var unauthorised = require('../test-data/unauthorised.json');
var wallet = require('../services/wallet')

function getUserWallet (userId) {
  return wallet.getWallet(userId)
}

router.post('/onboard-funds', function *(next) {
  var amount = this.headers['amount']
  var bearer = this.headers['authorization'];
  if (bearer === config.ContributorBearerTokenCode) {
    yield wallet.updateWallet(49, amount, 'in')
    this.status = 200
  } else if (bearer === config.OwnerBearerToken) {
    yield wallet.updateWallet(78, amount, 'in')
    this.status = 200
  } else if (bearer === config.ManagerBearerToken) {
    yield wallet.updateWallet(9, amount, 'in')
    this.status = 200
  } else {
    this.status = config.unauthorised;
    this.body = unauthorised;
  }
});

module.exports = router;
