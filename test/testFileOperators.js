const fs = require('fs');
const sinon = require('sinon');
const { assert } = require('chai');
const { loadData, loadFile } = require('../libs/fileOperators');

describe('fileHandlers', function() {
  describe('loadOlderTodoLogs', function() {
    it('should load the data if the file is present', function() {
      const fakeExists = sinon.fake.returns(true);
      const fakeReader = sinon.fake.returns(
        '{"ab":{"username":"ab","password":"1" ,"todo":"{}"}}'
      );
      sinon.replace(fs, 'existsSync', fakeExists);
      sinon.replace(fs, 'readFileSync', fakeReader);
      assert.deepStrictEqual(loadData('somePath'), {
        ab: { username: 'ab', password: '1', todo: { logs: {}, lastId: 1000 } }
      });
      sinon.assert.calledOnce(fakeExists);
      assert.ok(fakeExists.calledWithExactly('somePath'));
      sinon.restore();
    });

    it('should create file and load the logs if file is not present', () => {
      const fakeExists = sinon.fake.returns(false);
      const fakeReader = sinon.fake.returns('{}');
      const fakeWriter = sinon.fake();
      sinon.replace(fs, 'existsSync', fakeExists);
      sinon.replace(fs, 'writeFileSync', fakeWriter);
      sinon.replace(fs, 'readFileSync', fakeReader);
      assert.deepStrictEqual(loadData('anotherPath'), {});
      sinon.assert.calledOnce(fakeExists);
      assert.ok(fakeExists.calledWithExactly('anotherPath'));
      assert.ok(fakeReader.calledWithExactly('anotherPath', 'utf8'));
      assert.ok(fakeWriter.calledWithExactly('anotherPath', '{}'));
      sinon.restore();
    });
  });
  describe('loadFile', function() {
    it('should load file with the encoding if asked for.', function() {
      const fakeReader = sinon.fake.returns('{}');
      sinon.replace(fs, 'readFileSync', fakeReader);
      assert.deepStrictEqual(loadFile('abc', 'utf8'), '{}');
      assert.ok(fakeReader.calledWithExactly('abc', 'utf8'));
      sinon.restore();
    });
    it('should load file without encoding if encoding is not passed ', function() {
      const fakeReader = sinon.fake.returns('{}');
      sinon.replace(fs, 'readFileSync', fakeReader);
      assert.deepStrictEqual(loadFile('abc'), '{}');
      assert.ok(fakeReader.calledWithExactly('abc'));
      sinon.restore();
    });
  });
});
