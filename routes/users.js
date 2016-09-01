var router = require('koa-router')();
var config = require('../config');
var userDetails = require('../test-data/user-details.json');
var unauthorized = require('../test-data/unauthorized.json');

function getUserByType(type) {
  for (var i = 0; i < 6; i++) {

    if(userDetails.users[i].last_name === type) {
      return userDetails.users[i]
    }
  }
}

router.get('/', function *(next) {
  if(this.headers['authorization'] === config.OwnerBearerToken){
    this.body = getUserByType('Owner');
  } else if(this.headers['authorization'] === config.ContributorBearerToken){
    this.body = getUserByType('Contributor');
  } else if(this.headers['authorization'] === config.ManagerBearerToken){
    this.body = getUserByType('Manager');
  } else if(this.headers['authorization'] === config.JessieBearerToken){
    this.body = getUserByType('Jessie');
  } else if(this.headers['authorization'] === config.CourtneyBearerToken){
    this.body = getUserByType('Courtney');
  } else if(this.headers['authorization'] === config.RobBearerToken){
    this.body = getUserByType('Rob');
  } else {
    this.status = config.unauthorized;
    this.body = unauthorized;
  }
});

module.exports = router;
