var router = require('koa-router')();

var config = require('../config');
var unauthorized = require('../test-data/unauthorized.json');
var accept = require('../test-data/accept_offer.json');
var accept_partial = require('../test-data/accept_partial_offer.json');

router.get('/offers/accept/:id', function *(next, req) {
    if(this.headers['authorization'] === config.bearerToken && this.params.id == 1){
      this.status = config.okResponse;
      this.body = accept;
    }
    else {
        this.status = config.unauthorized;
        this.body = unauthorized;
    }
});

router.get('/offers/accept/partial/:offerId/:numShares', function * (next, req) {
  if(this.headers['authorization'] === config.bearerToken && this.params.offerId == 1) {
    this.status = config.okResponse;
    this.body = accept_partial;
  }
  else {
      this.status = config.unauthorized;
      this.body = unauthorized;
  }
});
module.exports = router;
