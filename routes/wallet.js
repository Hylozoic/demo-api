var router = require('koa-router')();

var config = require('../config');
router.get('/balance', function *(next) {
  console.log(this.headers);
  if(this.headers['authorization'] === config.bearerToken){
    this.body = 'authorized';
  }
  else{
    this.body = 'unauthorized';
  }
});

module.exports = router;
