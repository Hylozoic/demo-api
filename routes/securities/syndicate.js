var router = require('koa-router')();
var config = require('../../config');
var Syndicate = require('../../services/syndicate')
const TransactionHelper = require('./../../services/transaction-helper');

router.get('/', function * (next) {
  const body = this.request.body
  const hash = TransactionHelper.generateTransactionHash()
  const res = Syndicate.create(body.issueId, body.offerId, hash);

  this.status = config.okResponse;
  this.body = res;
});

module.exports = router;
