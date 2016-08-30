const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const Syndicate = require('./../../services/syndicate');
const ApplicationStore = require('./../../services/application-store');
const TransactionHelper = require('./../../services/transaction-helper');

describe('Offers', function () {
  var hash, issueId, offerId;

  before(function(){
    hash = TransactionHelper.generateTransactionHash()
    issueId = TransactionHelper.generateBigInt()
    offerId = TransactionHelper.generateBigInt()
  })

  it('create a syndicate', function () {
    const res = Syndicate.create(issueId, offerId, hash);
    expect(res.tx.hash).to.equal('0x' + hash);
    return ApplicationStore.getLog(hash).then((log) => {
      expect(log.data.id).to.equal(issueId)
      return ApplicationStore.getSyndicate(issueId).then((syndicate) => {
        expect(syndicate.offerId).to.equal(offerId)
        expect(syndicate.issueId).to.equal(issueId)
      }, (error) => {assert.fail(error)})
    }, (error) => {assert.fail(error)})
  })
})
