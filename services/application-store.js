const redis = require('redis')
const bluebird = require('bluebird')

const NAME_USERS = 'users'
const NAME_ISSUES = 'issues'
const NAME_OFFERS = 'offers'
const NAME_LOGS = 'logs'
const NAME_SYNDICATE = 'syndicate'
const NAME_WALLET = 'wallet'
const NAME_WALLET_LOCK = "wallet_lock"

const getRedisClient = function (isSync) {
  const url = process.env.REDIS_URL || 'redis://localhost:6379'
  const redisInfo = require('parse-redis-url')(redis).parse(url)
  const client = redis.createClient(redisInfo)
  if(!isSync){
    bluebird.promisifyAll(redis.RedisClient.prototype)
    bluebird.promisifyAll(redis.Multi.prototype)
  }
  return client
}

module.exports = {
  get: function(redisKey, redisHash){
    const client = getRedisClient()
    return client.hmgetAsync(redisKey, redisHash).then(
      (res) => {
        client.quit()
        if (res) {
          return JSON.parse(res)
        }
        return null
      })
  },

  set: function(redisKey, redisHash, obj, callback){
    const client = getRedisClient()
    client.hset(redisKey, redisHash, JSON.stringify(obj))
    client.quit()
  },

  getUser: function (username) {
    return this.get(NAME_USERS, username)
  },

  setUser: function (username, user) {
    this.set(NAME_USERS, username, user)
  },

  getIssue: function (id) {
    return this.get(NAME_ISSUES, id)
  },

  setIssue: function (issueId, issue) {
    this.set(NAME_ISSUES, issueId, issue)
  },

  getOffer: function (id) {
    return this.get(NAME_OFFERS, id)
  },

  setOffer: function (offerId, offer) {
    this.set(NAME_OFFERS, offerId, offer)
  },

  getSyndicate: function (id) {
    return this.get(NAME_SYNDICATE, id)
  },

  setSyndicate: function (syndicateId, syndicate){
    this.set(NAME_SYNDICATE, syndicateId, syndicate)
  },

  setOffer: function (offerId, offer) {
    this.set(NAME_OFFERS, offerId, offer)
  },

  setLog: function(hash, log){
    return this.set(NAME_LOGS, hash, log)
  },

  getLog: function (hash){
    return this.get(NAME_LOGS, hash)
  },

  setWallet: function (userId, wallet) {
    this.set(NAME_WALLET, userId, wallet)
  },

  getWallet: function (userId) {
    return this.get(NAME_WALLET, userId)
  },

  updateWallet: function(userId, amount, direction, callback){
    return new Promise((resolve, reject) => {
      const client = getRedisClient()
      client.watch(NAME_WALLET)
      return client.hmgetAsync(NAME_WALLET, userId).then((res) => {
          var wallet = JSON.parse(res)
          var etherAmount = amount * 1000000000000000000
          var balance;
          if (direction === 'out') {
            wallet.walletDetails.latest.amount
            = wallet.walletDetails.latest.amountAvailable
            = wallet.walletDetails.latest.amountOnHold
            = wallet.walletDetails.pending.amount
            = wallet.walletDetails.pending.amountAvailable
            = wallet.walletDetails.pending.amountOnHold
            = wallet.walletDetails.latest.amount - etherAmount
          } else if (direction === 'in') {
            wallet.walletDetails.latest.amount
            = wallet.walletDetails.latest.amountAvailable
            = wallet.walletDetails.latest.amountOnHold
            = wallet.walletDetails.pending.amount
            = wallet.walletDetails.pending.amountAvailable
            = wallet.walletDetails.pending.amountOnHold
            = wallet.walletDetails.latest.amount + etherAmount
          }

          return wallet
      })
      .then((wallet) => {
        client.hset(NAME_WALLET, userId, JSON.stringify(wallet), (err, res) => {
          if(callback){
            callback
          }
          client.unwatch()
          client.quit()
          resolve()
        })
      })
    })
  }
}
