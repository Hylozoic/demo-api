var router = require('koa-router')();
var config = require('../../config');
var Offers = require('../../services/offers')
const TransactionHelper = require('./../../services/transaction-helper');

router.post('/sell', function *(next) {
  const body = this.request.body
  const hash = TransactionHelper.generateTransactionHash()
  const offerId = TransactionHelper.generateBigInt()
  const res = Offers.create(body.issue_id, offerId, body.num_shares, body.price, hash);

  this.status = config.okResponse;
  this.body = res;
});

router.get('/accept/partial/:offerId/:numShares', function * (next) {
  const params = this.params
  const hash = TransactionHelper.generateTransactionHash()
  const holdingId = TransactionHelper.generateBigInt()

  this.status = config.okResponse;
  this.body = yield Offers.acceptPartial(params.offerId, params.numShares, holdingId, hash);
});

module.exports = router;
