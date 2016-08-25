var app = require('koa')()
  , koa = require('koa-router')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror')
  , logEverything = require('./middleware/log-everything');

var index = require('./routes/index');
var users = require('./routes/users');
var wallet = require('./routes/wallet');
var stabletoken = require('./routes/stabletoken');
var offers = require('./routes/securities/offers');
var issues = require('./routes/securities/issues');
var syndicate = require('./routes/securities/syndicate')
var logs = require('./routes/logs')
var funding = require('./routes/funding');
var oauth = require('./routes/oauth');

// global middlewares
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(logEverything());

app.use(function *(next) {
  try {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
    yield next;
  } catch (err) {
    console.error(err)
    this.status = err.status || 500;
    this.body = err.message;
    this.app.emit('error', err, this);
  }
});


app.use(require('koa-static')(__dirname + '/public'));
// routes definition
koa.use('/', index.routes(), index.allowedMethods());
koa.use('/api/users', users.routes(), users.allowedMethods());
koa.use('/api/wallet', wallet.routes(), wallet.allowedMethods());
koa.use('/api/stabletoken', stabletoken.routes(), stabletoken.allowedMethods());

koa.use('/api/securities/offers', offers.routes(), offers.allowedMethods());
koa.use('/api/securities/issues', issues.routes(), issues.allowedMethods());
koa.use('/api/securities/syndicate', syndicate.routes(), syndicate.allowedMethods());
koa.use('/api/logs', logs.routes(), logs.allowedMethods());

koa.use('/api/funding', funding.routes(), funding.allowedMethods());
koa.use('/oauth', oauth.routes());

// mount root routes
app.use(koa.routes());

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});

module.exports = app;
