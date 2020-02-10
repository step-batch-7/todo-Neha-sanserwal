const assert = require('chai').assert;
const { Bucket } = require('../libs/todo');

describe('Bucket', function() {
  describe('parse', function() {
    it('should parse todo', function() {
      const bucket = new Bucket('hello', 1, {}, 1000);
      assert.deepStrictEqual(Bucket.parse('hello', 1), bucket);
    });
  });
  describe('add', function() {
    it('should add new task', function() {
      const bucket = new Bucket('hello', 1, {}, 1000);
      bucket.add('hello');
      assert.deepStrictEqual(bucket, {
        title: 'hello',
        bucketId: 1,
        tasks: { 1000: 'hello' },
        lastTaskId: 1000
      });
    });
  });
  describe('delete', function() {
    it('should delete task of given task', function() {
      const bucket = new Bucket('hello', 1, { 1001: 'hello' }, 1000);
      bucket.delete(1001);
      assert.deepStrictEqual(bucket, {
        title: 'hello',
        bucketId: 1,
        tasks: {},
        lastTaskId: 1000
      });
    });
  });

  describe('newTask', function() {
    it('should generate new task id', function() {
      const bucket = new Bucket('hello', 1, { 1001: 'hello' }, 1000);
      assert.strictEqual(bucket.newTaskId, 1001);
    });
  });

  describe('changeStatus', function() {
    it('should change status of given task id', function() {
      const bucket = new Bucket(
        'hello',
        1,
        { 1001: { status: 'checked' } },
        1000
      );
      bucket.changeStatus(1001);
      assert.strictEqual(bucket.tasks[1001].status, '');
    });
  });
});
