
module.exports = {
  generateTransactionHash: function(){
    const crypto = require('crypto-extra')
    return crypto.randomString (64, 'ABCDEFG0123456789')
  },

  generateBigInt: function(){
    const crypto = require('crypto-extra')
    return crypto.randomNumber()
  }
}
