var router = require('koa-router')();

var config = require('../config');
var stabletoken = require('../test-data/stabletoken.json')
var unauthorized = require('../test-data/unauthorized.json');

router.get('/balances', function *(next) {
    if(this.headers['authorization'] === config.bearerToken){
        this.body = stabletoken;
    }
    else {
        this.status = config.unauthorized;
        this.body = unauthorized;
    }
});

module.exports = router;
