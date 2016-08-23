var chai = require('chai');
var expect = chai.expect;
var TransactionHelper = require('./../../services/transaction-helper');

describe('TransactionHelper', function () {
  it('generated 64 digit random hash', function () {
    const hash = TransactionHelper.generateTransactionHash();
    expect(hash.length).to.equal(64)
  })

  it('generated big integer', function(){
    const bigIntStr = TransactionHelper.generateBigInt();
    const bigInt = parseInt(bigIntStr)
    expect(bigInt).to.be.least(0)
    expect(bigInt).to.be.most(9007199254740991)
  })
})
