var router = require('koa-router')();

var config = require('../config');
var stabletoken = require('../test-data/stabletoken.json')
var authorised = require('./authorise')
var unauthorised = require('../test-data/unauthorised.json');
var wallet = require('../services/wallet')

function getUserWallet (userId) {
  return wallet.getWallet(userId)
}

router.get('/balances', function *(next) {
  var bearer = this.headers['authorization'];
  if (bearer === config.ContributorBearerToken) {
    this.body = (yield getUserWallet(49)).walletDetails
  } else if (bearer === config.OwnerBearerToken) {
    this.body = (yield getUserWallet(78)).walletDetails
  } else if (bearer === config.ManagerBearerToken) {
    this.body = (yield getUserWallet(9)).walletDetails
  } else if (bearer === config.JessieBearerToken) {
    this.body = (yield getUserWallet(18)).walletDetails
  } else if (bearer === config.CourtneyBearerToken) {
    this.body = (yield getUserWallet(27)).walletDetails
  } else if (bearer === config.RobBearerToken) {
    this.body = (yield getUserWallet(35)).walletDetails
  } else {
        this.status = config.unauthorised;
        this.body = unauthorised;
    }
});

module.exports = router;
