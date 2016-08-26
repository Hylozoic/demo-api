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

router.get('/balances', function *(next) {
  var bearer = this.headers['authorization'];
  if (bearer === config.contributorAuthCode) {
    this.body = getUserWallet(49)
  } else if (bearer === config.ownerAuthCode) {
    this.body = getUserWallet(78)
  } else if (bearer === config.managerAuthCode) {
    this.body = getUserWallet(9);
  } else {
    this.status = config.unauthorised;
    this.body = unauthorised;
  }
});

router.get('/balance/pending', function *(next) {
  var bearer = this.headers['authorization'];
  if (bearer === config.contributorAuthCode) {
    this.body = getUserWallet(49)
  } else if (bearer === config.ownerAuthCode) {
    this.body = getUserWallet(78)
  } else if (bearer === config.managerAuthCode) {
    this.body = getUserWallet(9);
  } else {
    this.status = config.unauthorised;
    this.body = unauthorised;
  }
});

module.exports = router;
