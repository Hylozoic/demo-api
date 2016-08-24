var config = require('../config');

module.exports = {
  isAuthorised: function(token) {
    if (token === config.OwnerBearerToken || token === config.ContributorBearerToken || token === config.ManagerBearerToken)
      return true
    else {
      return false
    }
  }
}
