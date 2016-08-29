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
  var bearer = this.headers['authorization'];
  var userId;
  if (bearer === config.ContributorBearerToken) {
    userId = 49
  } else if (bearer === config.OwnerBearerToken) {
    userId = 78
  } else if (bearer === config.ManagerBearerToken) {
    user_id = 9
  } else {
    this.status = config.unauthorised;
    this.body = unauthorised;
  }
  const params = this.params
  const hash = TransactionHelper.generateTransactionHash()
  const holdingId = TransactionHelper.generateBigInt()

  this.status = config.okResponse;
  this.body = yield Offers.acceptPartial(userId, params.offerId, params.numShares, holdingId, hash);
});

router.delete('/cancel/:offerId', function * (next){
  const hash = TransactionHelper.generateTransactionHash()
  this.status = config.okResponse;
  this.body = yield Offers.cancel(this.params.offerId, hash)
});

module.exports = router;
