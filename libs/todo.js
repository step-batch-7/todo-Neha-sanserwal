const { Task } = require('./task');

const isMatched = function(textA, textB) {
  const regExp = new RegExp(textB, 'ig');
  return regExp.test(textA);
};

class Bucket {
  constructor(title, bucketId, tasks, lastTaskId) {
    this.title = title;
    this.bucketId = bucketId;
    this.tasks = tasks;
    this.lastTaskId = lastTaskId;
  }
  static parse(text, id) {
    const title = text;
    const bucketId = id;
    const lastTaskId = 2000;
    const tasks = {};
    return new Bucket(title, bucketId, tasks, lastTaskId);
  }
  add(task) {
    this.tasks[this.lastTaskId] = task;
  }
  delete(taskId) {
    const tasks = this.tasks;
    delete tasks[taskId];
  }
  get newTaskId() {
    this.lastTaskId = ++this.lastTaskId;
    return this.lastTaskId;
  }
  changeHeading(text) {
    this.title = text;
  }
  changeStatus(itemId) {
    const { status, bucketId, taskId, text } = this.tasks[itemId];
    const task = new Task(status, bucketId, taskId, text);
    task.toggleStatus();
    this.tasks[itemId] = task;
  }
  edit(itemId, newText) {
    const { status, bucketId, taskId, text } = this.tasks[itemId];
    const task = new Task(status, bucketId, taskId, text);
    task.change(newText);
    this.tasks[itemId] = task;
  }
  hasTitle(text) {
    return isMatched(this.title, text);
  }

  hasTask(text) {
    const tasks = this.tasks;
    for (const [, task] of Object.entries(tasks)) {
      if (isMatched(task.text, text)) {
        return true;
      }
    }
  }
}

module.exports = { Bucket };
