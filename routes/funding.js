var router = require('koa-router')();
var authorized = require('./authorize')

var config = require('../config');
var unauthorized = require('../test-data/unauthorized.json');
var buy = require('../test-data/buy_order.json');
var sell = require('../test-data/sell_order.json');
var all = require('../test-data/all_orders.json');
var details = require('../test-data/order_details.json');
var rates = require('../test-data/funding_rates.json');

router.post('/orders', function *(next) {
    if(authorized.isauthorized(this.headers['authorization'])) {
        if (this.request.body['direction'] === config.buy) {
            this.status = config.successfulPost;
            this.body = buy;
        } else if (this.request.body['direction'] === config.sell) {
            this.status = config.successfulPost;
            this.body = sell;
        } else {
            this.status = config.unauthorized;
            this.body = unauthorized;
        }
    } else {
        this.status = config.unauthorized;
        this.body = unauthorized;
    }
});

router.get('/orders', function *(next) {
    if(authorized.isauthorized(this.headers['authorization'])){
        this.status = config.okResponse;
        this.body = all;
    } else {
        this.status = config.unauthorized;
        this.body = unauthorized;
    }
});

router.get('/orders/:id', function *(next) {
    if(authorized.isauthorized(this.headers['authorization']) && this.params.id == config.orderId){
        this.status = config.okResponse;
        this.body = details;
    } else {
        this.status = config.unauthorized;
        this.body = unauthorized;
    }
});

router.get('/rates', function *(next) {
    if(authorized.isauthorized(this.headers['authorization'])){
        this.status = config.okResponse;
        this.body = rates;
    } else {
        this.status = config.unauthorized;
        this.body = unauthorized;
    }
});


module.exports = router;
