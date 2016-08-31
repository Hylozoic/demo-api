const chai = require('chai')
const expect = chai.expect
const assert = chai.assert
const Offers = require('./../../services/offers')
const Issues = require('./../../services/issues')
const Wallet = require('./../../services/wallet')
const ApplicationStore = require('./../../services/application-store')
const TransactionHelper = require('./../../services/transaction-helper')

describe('Offers', function () {
  var numShares, issueId, offerId, price, userId1, userId2, issuerId,
  holdingId1,holdingId2, holdingId3, numSharesAccept1, numSharesAccept2, numSharesAccept3
  const exchangeRate = 1000000000000000000

  before(function () {
    numShares = 1000
    price = 0.01
    userId1 = 1
    issuerId = 2
    userId2 = 3
    issueId = TransactionHelper.generateBigInt()
    offerId = TransactionHelper.generateBigInt()
    holdingId1 = TransactionHelper.generateBigInt()
    holdingId2 = TransactionHelper.generateBigInt()
    holdingId3 = TransactionHelper.generateBigInt()
    numSharesAccept1 = 100
    numSharesAccept2 = 200
    numSharesAccept3 = 500
    Issues.create(numShares, TransactionHelper.generateTransactionHash(), issueId, issuerId)
    Wallet.createWallet(userId1, userId1, 80 * exchangeRate)
    Wallet.createWallet(issuerId, issuerId, 80 * exchangeRate)
    Wallet.createWallet(userId2, userId2, 80 * exchangeRate)
  })

  it('create an offer', function () {
    var hash = TransactionHelper.generateTransactionHash()
    const res = Offers.create(issueId, offerId, numShares, price, hash)
    expect(res.tx.hash).to.equal('0x' + hash)
    ApplicationStore.getLog(hash).then((log) => {
      expect(log.data.offerId).to.equal(offerId)
      return ApplicationStore.getOffer(offerId).then((offer) => {
        expect(offer.id).to.equal(offerId)
        expect(offer.issueId).to.equal(issueId)
        expect(offer.numShares).to.equal(numShares)
        expect(offer.price).to.equal(price * exchangeRate)
      }, (error) => {
        assert.fail(error)})
    }, (error) => {
      assert.fail(error)})
  }),

  it('first accept partial offer', function () {
    var hash = TransactionHelper.generateTransactionHash()
    return Offers.acceptPartial(userId1, offerId, numSharesAccept1, holdingId1, hash).then((res) => {
      expect(res.tx.hash).to.equal('0x' + hash)
      return ApplicationStore.getLog(hash).then((log) => {
        expect(log.data.id).to.equal(holdingId1)
        return ApplicationStore.getIssue(issueId).then((issue) => {

          expect(issue.all_holdings.length).to.equal(1)
          expect(issue.all_holdings[0].holder).to.equal(userId1)
          expect(issue.all_holdings[0].id).to.equal(holdingId1)
          expect(issue.all_holdings[0].issueId).to.equal(issueId)
          expect(issue.all_holdings[0].numShares).to.equal(numSharesAccept1)

          return Promise.all([Wallet.getWallet(userId1), Wallet.getWallet(issuerId)])
            .then((wallets) => {
              expect(wallets[0].walletDetails.latest.amount / exchangeRate).to.equal(80 - (numSharesAccept1 / 100))
              expect(wallets[1].walletDetails.latest.amount / exchangeRate).to.equal(80 + (numSharesAccept1 / 100))
            }, (error) => {
              assert.fail(error)})
        }, (error) => {
          assert.fail(error)})
      }, (error) => {
        assert.fail(error)})
    }, (error) => {
      assert.fail(error)})
  }),

  it('second user accept offer', function() {
    var hash = TransactionHelper.generateTransactionHash()
    return Offers.acceptPartial(userId2, offerId, numSharesAccept2, holdingId2, hash).then((res) => {
      expect(res.tx.hash).to.equal('0x' + hash)
      return ApplicationStore.getLog(hash).then((log) => {
        expect(log.data.id).to.equal(holdingId2)
        return ApplicationStore.getIssue(issueId).then((issue) => {

          expect(issue.all_holdings.length).to.equal(2)
          expect(issue.all_holdings[1].holder).to.equal(userId2)
          expect(issue.all_holdings[1].id).to.equal(holdingId2)
          expect(issue.all_holdings[1].issueId).to.equal(issueId)
          expect(issue.all_holdings[1].numShares).to.equal(numSharesAccept2)

          return Promise.all([Wallet.getWallet(userId2), Wallet.getWallet(issuerId)])
            .then((wallets) => {
              expect(wallets[0].walletDetails.latest.amount / exchangeRate).to.equal(80 - (numSharesAccept2 / 100))
              expect(wallets[1].walletDetails.latest.amount / exchangeRate).to.equal(80 + ((numSharesAccept1 + numSharesAccept2) / 100))
            }, (error) => {
              assert.fail(error)})
        }, (error) => {
          assert.fail(error)})
      }, (error) => {
        assert.fail(error)})
    }, (error) => {
      assert.fail(error)})
  }),

  it('first accept partial offer again', function () {
    var hash = TransactionHelper.generateTransactionHash()
    return Offers.acceptPartial(userId1, offerId, numSharesAccept3, holdingId3, hash).then((res) => {
      expect(res.tx.hash).to.equal('0x' + hash)
      return ApplicationStore.getLog(hash).then((log) => {
        expect(log.data.id).to.equal(holdingId3)
        return ApplicationStore.getIssue(issueId).then((issue) => {

          expect(issue.all_holdings.length).to.equal(3)
          expect(issue.all_holdings[2].holder).to.equal(userId1)
          expect(issue.all_holdings[2].id).to.equal(holdingId3)
          expect(issue.all_holdings[2].issueId).to.equal(issueId)
          expect(issue.all_holdings[2].numShares).to.equal(numSharesAccept3)

          return Promise.all([Wallet.getWallet(userId1), Wallet.getWallet(issuerId)])
            .then((wallets) => {
              expect(wallets[0].walletDetails.latest.amount / exchangeRate).to.equal(80 - ((numSharesAccept1 + numSharesAccept3) / 100))
              expect(wallets[1].walletDetails.latest.amount / exchangeRate).to.equal(80 + ((numSharesAccept1 + numSharesAccept2 + numSharesAccept3) / 100))
            }, (error) => {
              assert.fail(error)})
        }, (error) => {
          assert.fail(error)})
      }, (error) => {
        assert.fail(error)})
    }, (error) => {
      assert.fail(error)})
  }),

  it('cancel offer', function () {
    var hash = TransactionHelper.generateTransactionHash()
    return Offers.cancel(offerId, hash).then(() => {
      return ApplicationStore.getIssue(issueId).then((issue) => {
        expect(issue.all_holdings.length).to.equal(0)
        return Promise.all([Wallet.getWallet(userId1), Wallet.getWallet(userId2), Wallet.getWallet(issuerId)])
            .then((wallets) => {
              expect(wallets[0].walletDetails.latest.amount / exchangeRate).to.equal(80)
              expect(wallets[1].walletDetails.latest.amount / exchangeRate).to.equal(80)
              expect(wallets[2].walletDetails.latest.amount / exchangeRate).to.equal(80)
        }, (error) => {
          assert.fail(error)})
      }, (error) => {
        assert.fail(error)})
    })
  })
})
