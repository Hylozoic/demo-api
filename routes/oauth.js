var router = require('koa-router')()
var config = require('../config')
var views = require('co-views')
var logger = require('koa-logger')
var authorised = require('./authorise')
var koa = require('koa')
var manager_authorised = require('../test-data/manager_authorised.json')
var app = module.exports = koa()

var expectedTokenRequest = {
  grant_type: ['authorization_code', 'client_credentials'],
  code: config.authCode,
  client_id: config.client_id,
  client_secret: config.client_secret
}

<<<<<<< af2cc3baab1cb73cb643505a3c46a546296cee64
var syndicateTokenRequest = {
  grant_type: 'client_credentials',
  client_id: config.client_id,
  client_secret: config.client_secret
}

=======
var render = views(__dirname + '/../views', { ext: 'ejs' })
>>>>>>> updated the oauth/token to return token for syndicate manager

router.get('/authorise', function * (next) {
  this.body = yield render('login', {
    projectContributorCallbackUrl: this.query.redirect_uri + '?code=' + config.contributorAuthCode,
    syndicateManagerCallbackUrl: this.query.redirect_uri + '?code=' + config.managerAuthCode,
    projectOwnerCallbackUrl: this.query.redirect_uri + '?code=' + config.ownerAuthCode,
    failureUrl: this.query.redirect_uri + '?code=' + config.invalidAuthCode
  });
});

router.post('/token',function * (next){
    var body = this.request.body;
    if(body.client_id === expectedTokenRequest.client_id ||
    body.grant_type === syndicateTokenRequest.grant_type ||
    body.client_secret === expectedTokenRequest.client_secret)
    {
      this.body = manager_authorised
    }
    else if(
          body.client_id !== expectedTokenRequest.client_id ||
          body.grant_type !== expectedTokenRequest.grant_type ||
          body.client_secret !== expectedTokenRequest.client_secret
    ) {
      console.log('error request didn\'t match expected results.');
      console.log('Actual post body:',body );
      console.log('Expected post body to include:', expectedTokenRequest);
      this.status = 400;
      this.body = {error: 'invalid_request'};
      return;
    }else {
      if( body.code ===  config.contributorAuthCode ){
        this.body = contributor_authorised
      } else if (body.code === config.ownerAuthCode ) {
        this.body = owner_authorised
      } else if(body.code ===  config.invalidAuthCode){
        this.status = 400;
        this.body = {error: 'unauthorised_client'}
      }
    }
});

router.post('/token', function * (next) {
  var body = this.request.body
  if (!body.client_id) {
    body = this.query // backward support for hitfin since it only supports to put all the para in the query string
  }

  if (
    body.client_id !== expectedTokenRequest.client_id ||
    (!expectedTokenRequest.grant_type.includes(body.grant_type)) ||
    body.client_secret !== expectedTokenRequest.client_secret
  ) {
    console.log("error request didn't match expected results.")
    console.log('Actual post body:', body)
    console.log('Expected post body to include:', expectedTokenRequest)
    this.status = 400
    this.body = {error: 'invalid_request'}
  }else {
    this.status = 200
    this.body = manager_authorised
  }
});

module.exports = router;
