var router = require('koa-router')();
var config = require('../config');
var views = require('co-views');
var logger = require('koa-logger');
var koa = require('koa');
var app = module.exports = koa();

var expectedAuth = {
  response_type:'code',
  redirect_uri:'http://localhost:3001/noo/login/hit-fin/oauth',
  scope:'email',
  client_id:'foo'
}

var expectedTokenRequest = {
  grant_type: 'authorization_code',
  code: config.authCode,
  client_id: 'foo',
  client_secret: 'foo'
}


var render = views(__dirname + '/../views', { ext: 'ejs' });



router.get('/auth', function *(next) {
  this.body= yield render('login', {callbackUrl: this.query.redirect_uri + '?code=' + config.authCode});
});

router.post('/token',function * (next){
    var body = this.request.body;
    if(
          body.client_id !== expectedTokenRequest.client_id ||
          body.code !== expectedTokenRequest.code ||
          body.grant_type !== expectedTokenRequest.grant_type ||
          body.client_secret !== expectedTokenRequest.client_secret
    ) {
      console.log('error request didn\'t match ecpected results.');
      console.log('Actual post body:',body );
      console.log('Expected post body to include:', expectedTokenRequest);
      this.status = 401;
      this.body = {error: 'access_denied'};
      return;
    }
    this.body = {
        "access_token": config.bearerToken
    }
});


module.exports = router;
