var router = require('koa-router')();
var authorised = require('./authorise')

var config = require('../config');
var pending = require('../test-data/pending.json');
var settled = require('../test-data/settled.json');
var unauthorised = require('../test-data/unauthorised.json');

router.get('/balances', function *(next) {
  if(authorised.isAuthorised(this.headers['authorization'])){
    this.status = config.okResponse;
    this.body = settled;
  }
  else {
    this.status = config.unauthorised;
    this.body = unauthorised;
  }
});

router.get('/balance/pending', function *(next) {
  if(authorised.isAuthorised(this.headers['authorization'])){
    this.status = config.okResponse;
    this.body = pending;
  }
  else {
    this.status = config.unauthorised;
    this.body = unauthorised;
  }
});

module.exports = router;
