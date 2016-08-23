var router = require('koa-router')();
var accept = require('../../test-data/accept_offer.json');
var config = require('../../config');

router.post('/', function *(next, req) {
    this.status = config.okResponse;
    this.body = {
      "hash" : "0xc9d9c50e955d175b310c4cf120dd2ca4035172a57377bc9da9e270f5d1230b16"
    };
});

router.get('/:id', function *(next, req) {
    this.status = config.okResponse;
    this.body = {
      "id" : id
    };
});

module.exports = router;
