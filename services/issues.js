const ApplicationStore = require('./application-store');

module.exports = {
  create: function(numShares, hash, issueId){
    const issue = {
      numShares: numShares,
      id: issueId,
      issuer: ""
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
