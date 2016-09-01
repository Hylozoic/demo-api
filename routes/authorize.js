var config = require('../config');

module.exports = {
  isauthorized: function(token) {
    if (token === config.OwnerBearerToken || token === config.ContributorBearerToken || token === config.ManagerBearerToken)
      return true
    else {
      return false
    }
  }
}
