var router = require('koa-router')();
var config = require('../../config');
var Issues = require('../../services/issues')
const TransactionHelper = require('./../../services/transaction-helper');

router.post('/', function *(next) {
  const body = this.request.body
  const hash = TransactionHelper.generateTransactionHash()
  const issueId = TransactionHelper.generateBigInt()
  const res = Issues.create(body.num_shares, hash, issueId);

  this.status = config.okResponse;
  this.body = res
});

router.get('/:id', function *(next) {
  this.status = config.okResponse;
  this.body = yield Issues.get(this.params.id)
});

module.exports = router;
