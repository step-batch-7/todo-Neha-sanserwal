const { Task } = require('./task');
const getRandomId = function() {
  const range = 10;
  const randomId = Math.random() * Math.pow(range, range);
  return Math.floor(randomId);
};

class Bucket {
  constructor(title, bucketId, tasks) {
    this.title = title;
    this.bucketId = bucketId;
    this.tasks = tasks;
  }
  static parse(text) {
    const data = JSON.parse(text);
    const title = data.title;
    const bucketId = getRandomId();
    const newTask = Task.parse(bucketId, data.task);
    const tasks = { [newTask.taskId]: newTask };
    return new Bucket(title, bucketId, tasks);
  }
  add(task) {
    this.tasks[task.taskId] = task;
  }
  delete(taskId) {
    const tasks = this.tasks;
    delete tasks[taskId];
  }
}
class TodoLogs {
  constructor(logs) {
    this.logs = logs;
  }

  write(fileName, writer) {
    writer(fileName, this.logs);
  }

  append(bucket) {
    const bucketId = bucket.bucketId;
    this.logs[bucketId] = bucket;
  }

  deleteBucket(bucketId) {
    delete this.logs[bucketId];
  }

  appendTask(parentId, task) {
    const { title, bucketId, tasks } = this.logs[parentId];
    const bucket = new Bucket(title, bucketId, tasks);
    bucket.add(task);
    this.logs[parentId] = bucket;
  }

  deleteTask(parentId, taskId) {
    const { title, bucketId, tasks } = this.logs[parentId];
    const bucket = new Bucket(title, bucketId, tasks);
    bucket.delete(taskId);
  }
}

module.exports = {
  TodoLogs,
  Bucket
};
