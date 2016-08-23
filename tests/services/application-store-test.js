var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var ApplicationStore = require('./../../services/application-store');
var TransactionHelper = require('./../../services/transaction-helper');

describe('ApplicationStore', function () {
  it('user data should be stored in the redis', function () {
    const user = {
      username: 'user1',
      password: 'password1'
    }

    ApplicationStore.setUser(user.username, user);

    ApplicationStore.getUser(user.username)
    .then(function(data) {
      expect(data.username).to.equal(user.username);
      expect(data.password).to.equal(user.password);
    }, function(error) {
      assert.fail(error);
    });
  }),
  it('issue data should be stored in the redis', function () {
    const issue = {
      id: TransactionHelper.generateBigInt(),
      numShares: 1000
    }

    ApplicationStore.setIssue(issue.id, issue);

    ApplicationStore.getIssue(issue.id)
    .then(function(data) {
      expect(data.id).to.equal(issue.id);
      expect(data.numShares).to.equal(issue.numShares);
    }, function(error) {
      assert.fail(error);
    });
  })
})
