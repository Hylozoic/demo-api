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
var securities = require('./routes/securities');
var funding = require('./routes/funding');
var oauth = require('./routes/oauth');

// global middlewares
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(logEverything());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));
// routes definition
koa.use('/', index.routes(), index.allowedMethods());
koa.use('/api/users', users.routes(), users.allowedMethods());
koa.use('/api/wallet', wallet.routes(), wallet.allowedMethods());
koa.use('/api/stabletoken', stabletoken.routes(), stabletoken.allowedMethods());
koa.use('/api/securities', securities.routes(), securities.allowedMethods());
koa.use('/api/funding', funding.routes(), funding.allowedMethods());
koa.use('/oauth', oauth.routes());

// mount root routes
app.use(koa.routes());

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});

module.exports = app;
