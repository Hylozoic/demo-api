var router = require('koa-router')();
var config = require('../config');
var userDetails = require('../test-data/user-details.json');
var unauthorised = require('../test-data/unauthorised.json');

function getUser(type) {
  console.log("here")
  for (var i = 0; i < 3; i++) {
    if(userDetails.users[i].last_name === type) {
      return userDetails.users[i]
    }
  }
}

router.get('/', function *(next) {
  if(this.headers['authorization'] === config.OwnerBearerToken){
    this.body = getUser('Owner');
  } else if(this.headers['authorization'] === config.ContributorBearerToken){
    this.body = getUser('Contributor');
  } else if(this.headers['authorization'] === config.ManagerBearerToken){
    this.body = getUser('Manager');
  } else {
    this.status = config.unauthorised;
    this.body = unauthorised;
  }
});

module.exports = router;
