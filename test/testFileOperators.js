const fs = require('fs');
const sinon = require('sinon');
const { assert } = require('chai');
const fileHandler = require('../libs/fileOperators');

describe('fileHandlers', function() {
  describe('loadOlderTodoLogs', function() {
    it('should load the todo logs if the file is present', function() {
      const fakeExists = sinon.fake.returns(true);
      const fakeReader = sinon.fake.returns('{"1":"hello"}');
      sinon.replace(fs, 'existsSync', fakeExists);
      sinon.replace(fs, 'readFileSync', fakeReader);
      assert.deepStrictEqual(fileHandler.loadOlderTodoLogs('somePath'), {
        '1': 'hello'
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
      assert.deepStrictEqual(fileHandler.loadOlderTodoLogs('anotherPath'), {});
      sinon.assert.calledOnce(fakeExists);
      assert.ok(fakeExists.calledWithExactly('anotherPath'));
      assert.ok(fakeReader.calledWithExactly('anotherPath', 'utf8'));
      assert.ok(
        fakeWriter.calledWithExactly(
          '/Users/nehasanserwal/Documents/html/todo-Neha-sanserwal/libs/../docs/todos.json',
          '{}'
        )
      );
      sinon.restore();
    });
  });
});
