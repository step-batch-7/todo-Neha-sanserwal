const assert = require('chai').assert;
const { Task } = require('../libs/task');

describe('Task', function() {
  describe('parse', function() {
    it('should return the instance of class when provided bucket id task id and text', function() {
      const task = new Task('', 123, 23, 'hello');
      assert.deepStrictEqual(Task.parse(123, 23, 'hello'), task);
    });
  });
  describe('toggle', function() {
    it('should toggle status of task to checked from empty status.', function() {
      const task = new Task('', 123, 23, 'hello');
      task.toggleStatus();
      assert.strictEqual(task.status, 'checked');
    });
    it('should toggle status of task to empty from checked status.', function() {
      const task = new Task('checked', 123, 23, 'hello');
      task.toggleStatus();
      assert.strictEqual(task.status, '');
    });
  });
  describe('change', function() {
    it('should change text of task to given text', function() {
      const task = new Task('checked', 123, 23, 'hello');
      task.change('bye');
      assert.strictEqual(task.text, 'bye');
    });
  });
});
