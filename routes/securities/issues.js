var router = require('koa-router')();
var config = require('../../config');
var Issues = require('../../services/issues')
var unauthorised = require('../../test-data/unauthorised.json');
const TransactionHelper = require('./../../services/transaction-helper');

router.post('/', function *(next) {
  var bearer = this.headers['authorization'];
  var issuer_id;
  console.log(bearer)
  if (bearer === config.ContributorBearerToken) {
    issuer_id = 49
  } else if (bearer === config.OwnerBearerToken) {
    issuer_id = 78
  } else if (bearer === config.ManagerBearerToken) {
    issuer_id = 9
  } else if (bearer === config.JessieBearerToken) {
    issuer_id = 18
  } else if (bearer === config.CourtneyBearerToken) {
    issuer_id = 27
  } else if (bearer === config.RobBearerToken) {
    issuer_id = 35
  } else {
    this.status = config.unauthorised;
    this.body = unauthorised;
  }

  const body = this.request.body
  const hash = TransactionHelper.generateTransactionHash()
  const issueId = TransactionHelper.generateBigInt()
  const res = Issues.create(body.num_shares, hash, issueId, issuer_id);

  this.status = config.okResponse;
  this.body = res
});

router.get('/:id', function *(next) {
  this.status = config.okResponse;
  this.body = yield Issues.get(this.params.id)
});

module.exports = router;
