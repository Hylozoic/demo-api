const redis = require('redis')
const bluebird = require('bluebird')

const NAME_USERS = 'users'
const NAME_ISSUES = 'issues'
const NAME_OFFERS = 'offers'
const NAME_LOGS = 'logs'
const NAME_SYNDICATE = 'syndicate'

const getRedisClient = function () {
  const url = process.env.REDIS_URL || 'redis://localhost:6379'
  const redisInfo = require('parse-redis-url')(redis).parse(url)
  const client = redis.createClient(redisInfo)
  bluebird.promisifyAll(redis.RedisClient.prototype)
  bluebird.promisifyAll(redis.Multi.prototype)
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

  set: function(redisKey, redisHash, obj){
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
  }
}
