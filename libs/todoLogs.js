const { Bucket } = require('./todo');
const { Task } = require('./task');

const getId = function(keys) {
  const defaultKey = 1000;
  if (!keys.length) {
    return defaultKey;
  }
  const id = keys.sort().pop();
  return parseInt(id);
};

class TodoLogs {
  constructor(logs, lastId) {
    this.logs = logs;
    this.lastId = lastId;
  }

  static parse(logs) {
    const todoLogs = {};
    for (const key in logs) {
      const { title, bucketId, tasks, lastTaskId } = logs[key];
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
  getAllLogs() {
    return this.logs;
  }

  write(path, writer) {
    writer(path, this.logs);
  }

  append(title) {
    const bucket = Bucket.parse(title, this.newBucketId);
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
    this.logs[parentId].delete(taskId);
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

  toJSON() {
    return {
      logs: this.logs,
      lastId: this.lastId
    };
  }
}
module.exports = { TodoLogs };
