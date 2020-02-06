const { Task } = require('./task');
const getId = function(keys) {
  const defaultKey = 1000;
  if (!keys.length) {
    return +defaultKey;
  }
  return keys.sort().pop();
};

class Bucket {
  constructor(title, bucketId, tasks) {
    this.title = title;
    this.bucketId = bucketId;
    this.tasks = tasks;
  }
  static parse(text, id) {
    const data = JSON.parse(text);
    const title = data.title;
    const bucketId = id;
    const tasks = {};
    return new Bucket(title, bucketId, tasks);
  }
  add(task) {
    this.tasks[task.taskId] = task;
  }
  delete(taskId) {
    const tasks = this.tasks;
    delete tasks[taskId];
  }
  changeStatus(itemId) {
    const { status, bucketId, taskId, text } = this.tasks[itemId];
    const task = new Task(status, bucketId, taskId, text);
    task.toggleStatus();
    this.tasks[itemId] = task;
  }
}
class TodoLogs {
  constructor(logs, lastId) {
    this.logs = logs;
    this.lastId = lastId;
  }

  static parse(logs) {
    const todoLogs = {};
    for (const [key, value] of Object.entries(logs)) {
      const { title, bucketId, tasks } = value;
      todoLogs[key] = new Bucket(title, bucketId, tasks);
    }
    const keys = Object.keys(todoLogs);
    const lastId = getId(keys);
    return new TodoLogs(todoLogs, lastId);
  }
  get newBucketId() {
    this.lastId = ++this.lastId;
    return this.lastId;
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
    const bucket = this.logs[parentId];
    bucket.add(task);
  }

  deleteTask(parentId, taskId) {
    const { title, bucketId, tasks } = this.logs[parentId];
    const bucket = new Bucket(title, bucketId, tasks);
    bucket.delete(taskId);
  }
  changeTaskStatus(parentId, taskId) {
    const { title, bucketId, tasks } = this.logs[parentId];
    const bucket = new Bucket(title, bucketId, tasks);
    bucket.changeStatus(taskId);
    this.logs[parentId] = bucket;
  }
}

module.exports = {
  TodoLogs,
  Bucket
};
