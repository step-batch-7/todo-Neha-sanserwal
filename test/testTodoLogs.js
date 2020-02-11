const sinon = require('sinon');
const { assert } = require('chai');
const { TodoLogs } = require('../libs/todoLogs');
const { Bucket } = require('../libs/todo');
const { Task } = require('../libs/task');

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
      const bucket = new Bucket('office', 101, {}, 2000);
      todoLogs.append('office');
      assert.deepStrictEqual(todoLogs.logs[101], bucket);
    });
  });
  describe('deleteBucket', function() {
    it('should delete the todo of given id', function() {
      const bucket = new Bucket('office', 101, {}, 2000);
      const todoLogs = new TodoLogs({ 101: bucket }, 101);
      todoLogs.deleteBucket(101);
      assert.deepStrictEqual(todoLogs.logs, {});
    });
  });

  describe('editBucketTitle', function() {
    it('should edit the title of given todo id', function() {
      const bucket = new Bucket('office', 101, {}, 2000);
      const todoLogs = new TodoLogs({ 101: bucket }, 101);
      const expected = new Bucket('home', 101, {}, 2000);
      todoLogs.editBucketTitle(101, 'home');
      assert.deepStrictEqual(todoLogs.logs[101], expected);
    });
  });

  describe('appendTask', function() {
    it('should append new task to given bucket Id', function() {
      const task = new Task('', 101, 2001, 'take books');
      const bucket = new Bucket('office', 101, {}, 2000);
      const todoLogs = new TodoLogs({ 101: bucket }, 101);
      const expected = new Bucket('office', 101, { 2001: task }, 2001);
      todoLogs.appendTask(101, 'take books');
      assert.deepStrictEqual(todoLogs.logs[101], expected);
    });
  });

  describe('deleteTask', function() {
    it('should delete task of given bucket id and task id', function() {
      const task = new Task('', 101, 2001, 'take books');
      const bucket = new Bucket('office', 101, { 2001: task }, 2001);
      const todoLogs = new TodoLogs({ 101: bucket }, 101);
      const expected = new Bucket('office', 101, {}, 2001);
      todoLogs.deleteTask(101, 2001);
      assert.deepStrictEqual(todoLogs.logs[101], expected);
    });
  });

  describe('editTask', function() {
    it('should edit task of given bucket id and task id to given text', () => {
      const task1 = new Task('', 101, 2001, 'take books');
      const bucket = new Bucket('office', 101, { 2001: task1 }, 2001);
      const todoLogs = new TodoLogs({ 101: bucket }, 101);
      const task2 = new Task('', 101, 2001, 'take pens');
      const expected = new Bucket('office', 101, { 2001: task2 }, 2001);
      todoLogs.editTask(101, 2001, 'take pens');
      assert.deepStrictEqual(todoLogs.logs[101], expected);
    });
  });

  describe('changeStatus', function() {
    it('should change task status of given bucket id and task id', () => {
      const task1 = new Task('', 101, 2001, 'take books');
      const bucket1 = new Bucket('office', 101, { 2001: task1 }, 2001);
      const todoLogs = new TodoLogs({ 101: bucket1 }, 101);
      const task2 = new Task('checked', 101, 2001, 'take books');
      const bucket2 = new Bucket('office', 101, { 2001: task2 }, 2001);
      const expected = new TodoLogs({ 101: bucket2 }, 101);
      todoLogs.changeTaskStatus(101, 2001);
      assert.deepStrictEqual(todoLogs, expected);
    });
  });
});
