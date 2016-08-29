const ApplicationStore = require('./application-store')
const create =function(walletId, userId, balance){
   const wallet = {
     'walletId': walletId,
     'userId': userId,
     'walletDetails':{
       "latest": {
         "amount": balance,
         "amountAvailable": balance,
         "amountOnHold": 0
       },
       "pending": {
         "amount": balance,
         "amountAvailable": balance,
         "amountOnHold": 0
       }
     }
    }
   ApplicationStore.setWallet(userId, wallet)
 }

module.exports = {
  createDemoWallets : function() {
    create(1, 9, 5000000000000000000000);
    create(2, 49, 3458967894567890987500);
    create(3, 78, 80000000000000000000);
  },

  getWallet : function(userId) {
    return ApplicationStore.getWallet(userId);
  },

  updateWallet : function (user_id, amount, direction) {
    return ApplicationStore.getWallet(user_id).then( (wallet) => {
      var etherAmount = amount * 10000000000000000
      var balance;
      if (direction === 'out') {
        balance = wallet.walletDetails.latest.amount - etherAmount
        create(wallet.walletId, user_id, balance)
      } else if (direction === 'in') {
        etherAmount = etherAmount * 100
        balance = wallet.walletDetails.latest.amount + etherAmount
        create(wallet.walletId, user_id, balance)
      }
    })
  }
}
