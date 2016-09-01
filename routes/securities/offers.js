var router = require('koa-router')();
var config = require('../../config');
var Offers = require('../../services/offers')
const TransactionHelper = require('./../../services/transaction-helper');
var unauthorized = require('../../test-data/unauthorized.json');

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
  var user_id;
  if (bearer === config.ContributorBearerToken) {
    user_id = 49
  } else if (bearer === config.OwnerBearerToken) {
    user_id = 78
  } else if (bearer === config.ManagerBearerToken) {
    user_id = 9
  } else if (bearer === config.JessieBearerToken) {
    user_id = 18
  } else if (bearer === config.CourtneyBearerToken) {
    user_id = 27
  } else if (bearer === config.RobBearerToken) {
    user_id = 35
  } else {
    this.status = config.unauthorized;
    this.body = unauthorized;
  }
  const params = this.params
  const hash = TransactionHelper.generateTransactionHash()
  const holdingId = TransactionHelper.generateBigInt()

  this.status = config.okResponse;

  this.body = yield Offers.acceptPartial(user_id, params.offerId, params.numShares, holdingId, hash);
});

router.delete('/cancel/:offerId', function * (next){
  const hash = TransactionHelper.generateTransactionHash()
  this.status = config.okResponse;
  this.body = yield Offers.cancel(this.params.offerId, hash)
});

module.exports = router;
