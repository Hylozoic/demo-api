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

             ApplicationStore.setIssue(offer.issueId, issue)
             const log = {
               "data": {
                 "id": holdingId
               }
             }
             ApplicationStore.setLog(hash, log)

             return [holding, issue, hash]
        }, (error) => {throw error})
        .spread((holding, issue, hash) => {
          return Promise.all(
              [Wallet.updateWallet(holding.holder, holding.numShares/100, 'out'),
               Wallet.updateWallet(issue.issuer, holding.numShares/100, 'in'),
               hash
              ])
          .then((values) => {
            return values[2]
          })
        }, (error) => {throw error})
        .then((hash) => {
           return {
             "tx": {
               "hash": '0x' + hash
             }
           }
          }, (error) => {throw error})
      })
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
               return [all_holdings, issue, hash]
            }, (error) => {throw error})
          .spread((all_holdings, issue, hash) => {
            if(all_holdings && all_holdings.length > 0){
              var promises = []
              all_holdings.forEach(function(holding){
                promises.push(new Promise((resolve, reject) => {
                  return Promise.all(
                      [Wallet.updateWallet(holding.holder, holding.numShares/100, 'in'),
                       Wallet.updateWallet(issue.issuer, holding.numShares/100, 'out')
                     ])
                  .then(() => {resolve(1)})
                }))
              })

              promises.push(hash)
              return Promise.all(promises).then((values) => {
                return values[values.length - 1]
              })
          }
          else{
            return hash
          }
        }, (error) => {throw error})
      .then((hash) => {
        return {
          "tx": {
            "hash": '0x' + hash
          }
        }
      }, (error) => {throw error})
    }, (error) => {throw error})
  }
}
