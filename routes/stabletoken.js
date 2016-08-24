var router = require('koa-router')();

var config = require('../config');
var stabletoken = require('../test-data/stabletoken.json')
var authorised = require('./authorise')
var unauthorised = require('../test-data/unauthorised.json');

router.get('/balances', function *(next) {
    if(authorised.isAuthorised(this.headers['authorization'])){
      this.status = config.okResponse;
      this.body = stabletoken;
    }
    else {
        this.status = config.unauthorised;
        this.body = unauthorised;
    }
});

module.exports = router;
