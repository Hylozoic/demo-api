const ApplicationStore = require('./application-store')
const Wallet = require('./wallet')
const Promise = require('bluebird')

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

  acceptPartial: function(userId, offerId, numShares, holdingId, hash){
    return ApplicationStore.getOffer(offerId)
      .then((offer) => {
        return ApplicationStore.getIssue(offer.issueId).then(
          (issue) =>{
             if(!issue.all_holdings) {
               issue.all_holdings = []
             }
             const holding = {
                "holder": userId,
                "id": holdingId,
                "issueId": offer.issueId,
                "numShares": numShares
             }
             issue.all_holdings.push(holding)
             Wallet.updateWallet(userId, numShares / 100, 'out')
             ApplicationStore.setIssue(offer.issueId, issue)
             const log = {
               "data": {
                 "id": holdingId
               }
             }
             ApplicationStore.setLog(hash, log)
             return {
               "tx": {
                 "hash": '0x' + hash
               }
             }
          }, (error) => {throw error}
        )
      }, (error) => {throw error})
  },

  cancel: function(offerId, hash){
    return ApplicationStore.getOffer(offerId)
      .then((offer) => {
        return ApplicationStore.getIssue(offer.issueId).then(
          (issue) =>{
             const all_holdings = issue.all_holdings || new Array()
             issue.all_holdings = new Array()
             ApplicationStore.setIssue(offer.issueId, issue)
             const log = {
               "data": {
                 "id": offerId
               }
             }
             ApplicationStore.setLog(hash, log)
             return all_holdings
          }, (error) => {throw error}
        )
      }, (error) => {throw error})
      .then((all_holdings) => {

        if(all_holdings && all_holdings.length > 0){
          var promises = []
          all_holdings.forEach(function(holding){
            promises.push(new Promise((resolve, reject) => {
              Wallet.updateWallet(holding.holder, holding.numShares/100, 'in')
              resolve(holding)
            }))
          })
          return Promise.all(promises)
        }
        else{
          return
        }
      })
      .then(() => {
        return {
          "tx": {
            "hash": '0x' + hash
          }
        }
      })
  }
}
