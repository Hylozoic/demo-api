var router = require('koa-router')();
var wallet = require('../services/wallet')

router.get('/', function *(next) {
  console.log('create')
  wallet.createDemoWallets();
  this.body = 'created';
});

module.exports = router;
