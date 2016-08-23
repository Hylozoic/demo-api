var router = require('koa-router')();
var config = require('../config');
const ApplicationStore = require('./../services/application-store');

router.get('/tx_hash/:hash/0', function *(next) {
  this.status = config.okResponse;
  this.body = yield ApplicationStore.getLog(this.params.hash)
});

module.exports = router;
