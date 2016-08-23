const ApplicationStore = require('./application-store')

module.exports = {
  create: function (issueId, offerId, numShares, price, hash) {
    const offer = {
      'id': offerId,
      'issueId': issueId,
      'numShares': numShares,
      'price': price * 1000000000000000000
    }
    ApplicationStore.setOffer(offerId, offer)
    const log = {
      'data': {
        'offerId': offerId
      }
    }
    ApplicationStore.setLog(hash, log)
    return {
      "tx":{
        "hash": '0x' + hash
      }
    }
  },

  acceptPartial: function(offerId, numShares, holdingId, hash){
    return ApplicationStore.getOffer(offerId)
      .then((offer) => {
        return ApplicationStore.getIssue(offer.issueId).then(
          (issue) =>{
             if(!issue.all_holdings) {
               issue.all_holdings = []
             }
             const holding = {
                "holder": "projectContributor",
                "id": holdingId,
                "issueId": offer.issueId,
                "numShares": numShares
             }
             issue.all_holdings.push(holding)
             ApplicationStore.setIssue(offer.issueId, issue)
             const log = {
               "data": {
                 "id": holdingId
               }
             }
             ApplicationStore.setLog(hash, log)
             return {
               'hash': '0x' + hash
             }
          }, (error) => {throw error}
        )
      }, (error) => {throw error})
  }
}
