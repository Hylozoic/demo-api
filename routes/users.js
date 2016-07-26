var router = require('koa-router')();
var config = require('../config');
var userDetails = require('../test-data/user-details.json');
var unauthorized = require('../test-data/unauthorized.json');

router.get('/', function *(next) {
  if(this.headers['authorization'] === config.bearerToken){
    this.status = config.okResponse;
    this.body = userDetails;
  }
  else {
    this.status = config.unauthorized;
    this.body = unauthorized;
  }
});

module.exports = router;
