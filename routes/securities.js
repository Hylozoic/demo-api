var router = require('koa-router')();

var config = require('../config');
var authorised = require('./authorise')

var unauthorised = require('../test-data/unauthorised.json');
var accept = require('../test-data/accept_offer.json');
var accept_partial = require('../test-data/accept_partial_offer.json');
var get_offers = require('../test-data/get_offers.json');
var cancel_offers = require('../test-data/cancel_offer.json');

router.get('/offers/accept/:id', function *(next, req) {
    if(authorised.isAuthorised(this.headers['authorization']) && this.params.id == 1){
      this.status = config.okResponse;
      this.body = accept;
    }
    else {
        this.status = config.unauthorised;
        this.body = unauthorised;
    }
});

router.get('/offers/accept/partial/:offerId/:numShares', function * (next, req) {
  if(authorised.isAuthorised(this.headers['authorization']) && this.params.offerId == 1) {
    this.status = config.okResponse;
    this.body = accept_partial;
  }
  else {
      this.status = config.unauthorised;
      this.body = unauthorised;
  }
});

router.get('/offers/:id', function *(next, req) {
    if(authorised.isAuthorised(this.headers['authorization']) && this.params.id == 1){
      this.status = config.okResponse;
      this.body = get_offers;
    }
    else {
        this.status = config.unauthorised;
        this.body = unauthorised;
    }
});

router.get('/offers/cancel/:id', function *(next, req) {
  if(authorised.isAuthorised(this.headers['authorization']) && this.params.id == 1){
    this.status = config.okResponse;
    this.body = cancel_offer;
  }
  else {
      this.status = config.unauthorised;
      this.body = unauthorised;
  }
});
module.exports = router;
