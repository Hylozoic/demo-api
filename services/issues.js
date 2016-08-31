const ApplicationStore = require('./application-store');
var unauthorised = require('../test-data/unauthorised.json');

module.exports = {
  create: function(numShares, hash, issueId, issuer){
    const issue = {
      numShares: numShares,
      id: issueId,
      issuer: issuer
    }
    ApplicationStore.setIssue(issueId, issue)
    const log = {
      "data": {
        "issueId": issueId
      }
    }
    ApplicationStore.setLog(hash, log)
    return {
      "hash" : "0x"+hash
    }
  },

  get: function(id){
    return ApplicationStore.getIssue(id)
  }
}
