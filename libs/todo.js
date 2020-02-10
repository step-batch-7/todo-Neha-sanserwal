const { Task } = require('./task');
const getId = function(keys) {
  const defaultKey = 1000;
  if (!keys.length) {
    return +defaultKey;
  }
  return keys.sort().pop();
};

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
class TodoLogs {
  constructor(logs, lastId) {
    this.logs = logs;
    this.lastId = lastId;
  }

  static parse(logs) {
    const todoLogs = {};
    for (const [key, value] of Object.entries(logs)) {
      const { title, bucketId, tasks, lastTaskId } = value;
      todoLogs[key] = new Bucket(title, bucketId, tasks, lastTaskId);
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

  editBucketTitle(id, text) {
    const bucket = this.logs[id];
    bucket.changeHeading(text);
  }

  appendTask(parentId, text) {
    const bucket = this.logs[parentId];
    const task = Task.parse(parentId, bucket.newTaskId, text);
    bucket.add(task);
  }

  deleteTask(parentId, taskId) {
    const { title, bucketId, tasks } = this.logs[parentId];
    const bucket = new Bucket(title, bucketId, tasks);
    bucket.delete(taskId);
  }
  editTask(bucketId, taskId, text) {
    const bucket = this.logs[bucketId];
    bucket.edit(taskId, text);
  }
  changeTaskStatus(parentId, taskId) {
    const bucket = this.logs[parentId];
    bucket.changeStatus(taskId);
  }

  searchTask(text) {
    const searchedLogs = {};
    const buckets = Object.values(this.logs);
    buckets.forEach(function(bucket) {
      if (bucket.hasTask(text)) {
        searchedLogs[bucket.bucketId] = bucket;
      }
    });
    return searchedLogs;
  }
  searchTitle(text) {
    const searchedLogs = {};
    const buckets = Object.values(this.logs);
    buckets.forEach(function(bucket) {
      if (bucket.hasTitle(text)) {
        searchedLogs[bucket.bucketId] = bucket;
      }
    });
    return searchedLogs;
  }
}

module.exports = {
  TodoLogs,
  Bucket
};
