const sinon = require('sinon');
const { assert } = require('chai');
const { Session } = require('../libs/session');

describe('Session', function() {
  describe('createSession', function() {
    before(() => {
      sinon.stub(Math, 'random').returns(4);
      sinon.useFakeTimers(new Date('1/1/1997').getTime());
    });
    it('should create new session for given user', function() {
      const expected = new Session(852057040000, 'john');
      assert.deepStrictEqual(Session.createSession('john'), expected);
    });
  });
  describe('isEqualTo', function() {
    it('should give true if the object value are equal to the session values', function() {
      const actual = new Session(1, 'john');
      const cookie = { id: 1, user: 'john' };
      assert.ok(actual.isEqualTo(cookie));
    });
    it('should give false if the object value are not equal to the session values', function() {
      const actual = new Session(1, 'john');
      const cookie = { id: 0, user: 'john' };
      assert.notOk(actual.isEqualTo(cookie));
    });
  });
  describe('currentSession', function() {
    it('should give the sessionId and sessionUser ', function() {
      const actual = new Session(1, 'john');
      const expected = { id: 1, user: 'john' };
      assert.deepStrictEqual(actual.currentSession, expected);
    });
  });
});
