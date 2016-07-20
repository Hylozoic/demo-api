var router = require('koa-router')();

var config = require('../config');
var unauthorized = require('../test-data/unauthorized.json');
var buy = require('../test-data/buy_order.json');
var sell = require('../test-data/sell_order.json');
var all = require('../test-data/all_orders.json');
var details = require('../test-data/order_details.json');
var rates = require('../test-data/funding_rates.json');

router.post('/orders', function *(next, req) {
    if(this.headers['authorization'] === config.bearerToken) {
        console.log (this.body.direction)
        if (this.body.direction == config.buy) {
            this.body = buy;
        } else if (this.body['direction'] == config.sell) {
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
    if(this.headers['authorization'] === config.bearerToken){
        this.body = all;
    } else {
        this.status = config.unauthorized;
        this.body = unauthorized;
    }
});

router.get('/orders/:id', function *(next) {
    if(this.headers['authorization'] === config.bearerToken && this.params.id == config.orderId){
        this.body = details;
    } else {
        this.status = config.unauthorized;
        this.body = unauthorized;
    }
});

router.get('/rates', function *(next) {
    if(this.headers['authorization'] === config.bearerToken){
        this.body = rates;
    } else {
        this.status = config.unauthorized;
        this.body = unauthorized;
    }
});


module.exports = router;