var router = require('koa-router')();

router.get('/', function *(next) {
  this.body = 'hello world';
});

module.exports = router;
