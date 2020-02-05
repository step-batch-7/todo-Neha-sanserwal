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
    const tasks = { ...Task.parseEntryItem(bucketId, data.task) };
    return new Bucket(title, bucketId, tasks);
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

  appendTask(bucketId, task) {
    const tasks = this.logs[bucketId].tasks;
    const taskId = task.details.taskId;
    tasks[taskId] = task.details;
  }

  deleteTask(bucketId, taskId) {
    const bucket = this.logs[bucketId];
    const tasks = bucket.tasks;
    delete tasks[taskId];
  }
}

module.exports = {
  TodoLogs,
  Bucket
};
