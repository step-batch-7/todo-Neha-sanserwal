const assert = require('chai').assert;
const { Bucket } = require('../libs/todo');

describe('Bucket', function() {
  describe('parse', function() {
    it('should parse todo', function() {
      const bucket = new Bucket('class', 1, {}, 2000);
      assert.deepStrictEqual(Bucket.parse('class', 1), bucket);
    });
  });
  describe('add', function() {
    it('should add new task', function() {
      const bucket = new Bucket('class', 1, {}, 1000);
      bucket.add('take books');
      assert.deepStrictEqual(bucket, {
        title: 'class',
        bucketId: 1,
        tasks: { 1000: 'take books' },
        lastTaskId: 1000
      });
    });
  });
  describe('delete', function() {
    it('should delete task of given task', function() {
      const bucket = new Bucket('class', 1, { 1001: 'take book' }, 1000);
      bucket.delete(1001);
      assert.deepStrictEqual(bucket, {
        title: 'class',
        bucketId: 1,
        tasks: {},
        lastTaskId: 1000
      });
    });
  });

  describe('newTask', function() {
    it('should generate new task id', function() {
      const bucket = new Bucket('class', 1, { 1001: 'class' }, 1000);
      assert.strictEqual(bucket.newTaskId, 1001);
    });
  });

  describe('changeStatus', function() {
    it('should change status of given task id', function() {
      const bucket = new Bucket(
        'class',
        1,
        { 1001: { status: 'checked' } },
        1000
      );
      bucket.changeStatus(1001);
      assert.strictEqual(bucket.tasks[1001].status, '');
    });
  });
  describe('changeHeading', function() {
    it('should change the title of todo', function() {
      const bucket = new Bucket('class', 1, {}, 1000);
      bucket.changeHeading('bye');
      assert.strictEqual(bucket.title, 'bye');
    });
  });
  describe('edit', function() {
    it('should edit task message to given text of given task id', function() {
      const bucket = new Bucket(
        'class',
        1,
        { 1001: { status: 'checked', text: 'take books' } },
        1000
      );
      bucket.edit(1001, 'take pens');
      assert.strictEqual(bucket.tasks[1001].text, 'take pens');
    });
  });
  describe('hasTitle', function() {
    it('should validate if given todo has the title', function() {
      const bucket = new Bucket('class', 1, {}, 1000);
      assert.ok(bucket.hasTitle('class'));
    });
  });
  describe('hasTask', function() {
    it('should validate if given todo has the task', function() {
      const bucket = new Bucket(
        'class',
        1,
        { 1001: { status: 'checked', text: 'take books' } },
        1000
      );
      assert.ok(bucket.hasTask('take'));
    });
  });
  describe('toJSON', function() {
    it('should return the stringified data', function() {
      const bucket = new Bucket('class', 1, {}, 2000);
      assert.deepStrictEqual(bucket.toJSON(), {
        title: 'class',
        bucketId: 1,
        tasks: {},
        lastTaskId: 2000
      });
    });
  });
});
