var router = require('koa-router')()
var config = require('../config')
var views = require('co-views')
var logger = require('koa-logger')
var authorised = require('./authorise')
var koa = require('koa')
var contributor_authorised = require('../test-data/contributor_authorised.json');
var manager_authorised = require('../test-data/manager_authorised.json');
var owner_authorised = require('../test-data/owner_authorised.json');
var jessie_authorised = require('../test-data/jessie_authorised.json');
var courtney_authorised = require('../test-data/courtney_authorised.json');
var rob_authorised = require('../test-data/rob_authorised.json');
var app = module.exports = koa();

var expectedTokenRequest = {
  grant_type: 'authorization_code',
  code: config.authCode,
  client_id: config.client_id,
  client_secret: config.client_secret
}

var syndicateTokenRequest = {
  grant_type: 'client_credentials',
  client_id: config.client_id,
  client_secret: config.client_secret
}

var render = views(__dirname + '/../views', { ext: 'ejs' })

router.get('/authorize', function *(next) {
  this.body= yield render('login', {
    projectContributorCallbackUrl: this.query.redirect_uri + '?code=' + config.contributorAuthCode,
    syndicateManagerCallbackUrl: this.query.redirect_uri + '?code=' + config.managerAuthCode,
    projectOwnerCallbackUrl: this.query.redirect_uri + '?code=' + config.ownerAuthCode,
    JessieOwnerCallbackUrl: this.query.redirect_uri + '?code=' + config.JessieAuthCode,
    CourtneyOwnerCallbackUrl: this.query.redirect_uri + '?code=' + config.CourtneyAuthCode,
    RobOwnerCallbackUrl: this.query.redirect_uri + '?code=' + config.RobAuthCode,
    failureUrl: this.query.redirect_uri + '?code=' + config.invalidAuthCode
  });
});

router.post('/token', function * (next) {
  var body = this.request.body
  if (!body.client_id) {
    body = this.query // backward support for hitfin since it only supports to put all the para in the query string
  }

  if (body.client_id === syndicateTokenRequest.client_id &&
    body.grant_type === syndicateTokenRequest.grant_type &&
    body.client_secret === syndicateTokenRequest.client_secret) {
    this.status = 200
    this.body = manager_authorised
  }
  else if (
    body.client_id !== expectedTokenRequest.client_id ||
    body.grant_type !== expectedTokenRequest.grant_type ||
    body.client_secret !== expectedTokenRequest.client_secret
  ) {
    console.log("error request didn't match expected results.")
    console.log('Actual post body:', body)
    console.log('Expected post body to include:', expectedTokenRequest)
    this.status = 400
    this.body = {error: 'invalid_request'}
    return
  }else {
    if (body.code === config.contributorAuthCode) {
      this.body = contributor_authorised
    } else if (body.code === config.ownerAuthCode) {
      this.body = owner_authorised
    } else if (body.code === config.managerAuthCode) {
      this.body = manager_authorised
    } else if (body.code === config.JessieAuthCode) {
      this.body = jessie_authorised
    } else if (body.code === config.CourtneyAuthCode) {
      this.body = courtney_authorised
    } else if (body.code === config.RobAuthCode) {
      this.body = rob_authorised
    } else if (body.code === config.invalidAuthCode) {
      this.status = 400
      this.body = {error: 'unauthorised_client'}
    }
  }
});

module.exports = router
