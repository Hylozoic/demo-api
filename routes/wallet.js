var router = require('koa-router')();

var config = require('../config');
var walletData = require('../test-data/wallet.json');
var unauthorized = require('../test-data/unauthorized.json');

router.get('/balance', function *(next) {
  if(this.headers['authorization'] === config.bearerToken){
    this.body = walletData;
  }
  else {
    this.status = 401;
    this.body = unauthorized;
  }
});

module.exports = router;
