const chai = require('chai')
const expect = chai.expect
const assert = chai.assert
const Offers = require('./../../services/offers')
const Issues = require('./../../services/issues')
const Wallet = require('./../../services/wallet')
const ApplicationStore = require('./../../services/application-store')
const TransactionHelper = require('./../../services/transaction-helper')

describe('Offers', function () {
  var numShares, issueId, offerId, price, userId, issuerId, holdingId, numSharesAccept
  const exchangeRate = 1000000000000000000

  before(function () {
    numShares = 1000
    price = 0.01
    userId = 1
    issuerId = 2
    issueId = TransactionHelper.generateBigInt()
    offerId = TransactionHelper.generateBigInt()
    holdingId = TransactionHelper.generateBigInt()
    numSharesAccept = 100
    Issues.create(numShares, TransactionHelper.generateTransactionHash(), issueId, issuerId)
    Wallet.createWallet(userId, userId, 80 * exchangeRate)
    Wallet.createWallet(issuerId, issuerId, 80 * exchangeRate)
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

  it('accept partial offer', function () {
    var hash = TransactionHelper.generateTransactionHash()
    return Offers.acceptPartial(userId, offerId, numSharesAccept, holdingId, hash).then((res) => {
      expect(res.tx.hash).to.equal('0x' + hash)
      return ApplicationStore.getLog(hash).then((log) => {
        expect(log.data.id).to.equal(holdingId)
        return ApplicationStore.getIssue(issueId).then((issue) => {

          expect(issue.all_holdings.length).to.equal(1)
          expect(issue.all_holdings[0].holder).to.equal(userId)
          expect(issue.all_holdings[0].id).to.equal(holdingId)
          expect(issue.all_holdings[0].issueId).to.equal(issueId)
          expect(issue.all_holdings[0].numShares).to.equal(numSharesAccept)

          return Promise.all([Wallet.getWallet(userId), Wallet.getWallet(issuerId)])
            .then((wallets) => {
              expect(wallets[0].walletDetails.latest.amount / exchangeRate).to.equal(80 - (numSharesAccept / 100))
              expect(wallets[1].walletDetails.latest.amount / exchangeRate).to.equal(80 + (numSharesAccept / 100))
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
        return Promise.all([Wallet.getWallet(userId), Wallet.getWallet(issuerId)])
            .then((wallets) => {
              expect(wallets[0].walletDetails.latest.amount / exchangeRate).to.equal(80)
              expect(wallets[1].walletDetails.latest.amount / exchangeRate).to.equal(80)
        }, (error) => {
          assert.fail(error)})
      }, (error) => {
        assert.fail(error)})
    })
  })
})
