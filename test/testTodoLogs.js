const sinon = require('sinon');
const { assert } = require('chai');
const { TodoLogs } = require('../libs/todoLogs');

describe('TodoLogs', function() {
  describe('parse', function() {
    it('should parse all the todo inside the logs', function() {
      const logs = {
        1: { bucketId: 1, tasks: {}, lastTaskId: 0, title: 'office' }
      };
      const todoLogs = new TodoLogs(
        {
          1: { bucketId: 1, tasks: {}, lastTaskId: 0, title: 'office' }
        },
        1
      );
      assert.deepStrictEqual(TodoLogs.parse(logs), todoLogs);
    });
  });

  describe('newBucketId', function() {
    it('should return new todo id', function() {
      const todoLogs = new TodoLogs({}, 2000);
      assert.strictEqual(todoLogs.newBucketId, 2001);
    });
  });

  describe('write', function() {
    it('should write the data to given file', function() {
      const fakeWrite = sinon.fake();
      const todoLogs = new TodoLogs({}, 2000);
      todoLogs.write('./path', fakeWrite);
      sinon.assert.calledOnce(fakeWrite);
    });
  });

  describe('append', function() {
    it('should append the new todo of given title to todoLogs', function() {
      const todoLogs = new TodoLogs({}, 100);
      todoLogs.append('office');
      assert.deepStrictEqual(todoLogs.logs[101], {
        bucketId: 101,
        title: 'office',
        lastTaskId: 2000,
        tasks: {}
      });
    });
  });
  describe('deleteBucket', function() {
    it('should delete the todo of given id', function() {
      const todoLogs = new TodoLogs(
        {
          1: { bucketId: 1, tasks: {}, lastTaskId: 0, title: 'office' }
        },
        1
      );
      todoLogs.deleteBucket(1);
      assert.deepStrictEqual(todoLogs.logs, {});
    });
  });
  describe('editBucketTitle', function() {
    it('should edit the title of given todo id', function() {
      const todoLogs = TodoLogs.parse({
        1: { bucketId: 1, tasks: {}, lastTaskId: 0, title: 'office' }
      });
      todoLogs.editBucketTitle(1, 'home');
      assert.strictEqual(todoLogs.logs[1].title, 'home');
    });
  });
});
