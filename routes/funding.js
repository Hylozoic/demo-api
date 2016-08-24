var router = require('koa-router')();
var authorised = require('./authorise')

var config = require('../config');
var unauthorised = require('../test-data/unauthorised.json');
var buy = require('../test-data/buy_order.json');
var sell = require('../test-data/sell_order.json');
var all = require('../test-data/all_orders.json');
var details = require('../test-data/order_details.json');
var rates = require('../test-data/funding_rates.json');

router.post('/orders', function *(next) {
    if(authorised.isAuthorised(this.headers['authorization'])) {
        if (this.request.body['direction'] === config.buy) {
            this.status = config.successfulPost;
            this.body = buy;
        } else if (this.request.body['direction'] === config.sell) {
            this.status = config.successfulPost;
            this.body = sell;
        } else {
            this.status = config.unauthorised;
            this.body = unauthorised;
        }
    } else {
        this.status = config.unauthorised;
        this.body = unauthorised;
    }
});

router.get('/orders', function *(next) {
    if(authorised.isAuthorised(this.headers['authorization'])){
        this.status = config.okResponse;
        this.body = all;
    } else {
        this.status = config.unauthorised;
        this.body = unauthorised;
    }
});

router.get('/orders/:id', function *(next) {
    if(authorised.isAuthorised(this.headers['authorization']) && this.params.id == config.orderId){
        this.status = config.okResponse;
        this.body = details;
    } else {
        this.status = config.unauthorised;
        this.body = unauthorised;
    }
});

router.get('/rates', function *(next) {
    if(authorised.isAuthorised(this.headers['authorization'])){
        this.status = config.okResponse;
        this.body = rates;
    } else {
        this.status = config.unauthorised;
        this.body = unauthorised;
    }
});


module.exports = router;
