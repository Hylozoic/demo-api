const chai = require('chai')
const expect = chai.expect
const assert = chai.assert
const Offers = require('./../../services/offers')
const Issues = require('./../../services/issues')
const ApplicationStore = require('./../../services/application-store')
const TransactionHelper = require('./../../services/transaction-helper')

describe('Offers', function () {
  var numShares, issueId, offerId, price

  before(function () {
    numShares = 1000
    price = 0.01
    issueId = TransactionHelper.generateBigInt()
    offerId = TransactionHelper.generateBigInt()
    console.log(issueId)
    console.log(offerId)
    Issues.create(numShares, TransactionHelper.generateTransactionHash(), issueId)
  })

  it('create an offer', function () {
    var hash = TransactionHelper.generateTransactionHash()
    const res = Offers.create(issueId, offerId, numShares, price, hash)
    expect(res.tx.hash).to.equal('0x' + hash)
    ApplicationStore.getLog(hash).then((log) => {
      expect(log.data.offerId).to.equal(offerId)
      ApplicationStore.getOffer(offerId).then((offer) => {
        expect(offer.id).to.equal(offerId)
        expect(offer.issueId).to.equal(issueId)
        expect(offer.numShares).to.equal(numShares)
        expect(offer.price).to.equal(price * 1000000000000000000)
      }, (error) => {
        assert.fail(error)})
    }, (error) => {
      assert.fail(error)})
  }),

  it('accept partial offer', function () {
    var hash = TransactionHelper.generateTransactionHash()
    const holdingId = TransactionHelper.generateBigInt()
    const numSharesAccept = 100
    Offers.acceptPartial(offerId, numSharesAccept, holdingId, hash).then((res) => {
      expect(res.hash).to.equal('0x' + hash)
      ApplicationStore.getLog(hash).then((log) => {
        expect(log.data.id).to.equal(holdingId)
        ApplicationStore.getIssue(issueId).then((issue) => {
          expect(issue.all_holdings.length).to.equal(1)
          expect(issue.all_holdings[0].holder).to.equal('projectContributor')
          expect(issue.all_holdings[0].id).to.equal(holdingId)
          expect(issue.all_holdings[0].issueId).to.equal(issueId)
          expect(issue.all_holdings[0].numShares).to.equal(numSharesAccept)
        }, (error) => {
          assert.fail(error)})
      }, (error) => {
        assert.fail(error)})
    }, (error) => {
      assert.fail(error)})
  })
})
