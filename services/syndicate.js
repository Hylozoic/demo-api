const ApplicationStore = require('./application-store');

module.exports = {
  create: function(issueId, offerId, hash){
    const syndicate = {
      "issueId": issueId,
      "offerId": offerId
    }
    ApplicationStore.setSyndicate(issueId, syndicate)
    const log = {
      "data": {
        "id": issueId
      }
    }
    ApplicationStore.setLog(hash, log)
    return {
      "tx": {
        "hash" : "0x"+hash
      }
    }
  }
}
