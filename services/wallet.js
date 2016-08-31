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
    create(2, 49, 3000000000000000000000);
    create(3, 78, 80000000000000000000);
    create(3, 18, 1000000000000000000);
    create(3, 27, 3918000000000000000000);
    create(3, 35, 4032000000000000000000);
  },

  createWallet: function(walletId, userId, weiBalance){
    create(walletId, userId, weiBalance)
  },

  getWallet : function(userId) {
    return ApplicationStore.getWallet(userId);
  },

  updateWallet : function (userId, amount, direction, callback) {
    return ApplicationStore.updateWallet(userId, amount, direction, callback);
  }
}
