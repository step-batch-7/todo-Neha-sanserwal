const { Task } = require('./task');
const getRandomId = function() {
  const range = 10;
  const randomId = Math.random() * Math.pow(range, range);
  return Math.floor(randomId);
};
class TodoLogs {
  constructor(logs) {
    this.logs = logs;
  }

  static parseNewEntry(text) {
    const data = JSON.parse(text);
    const title = data.title;
    const bucketId = getRandomId();
    const tasks = { ...Task.parseEntryItem(bucketId, data.task) };
    return { title, bucketId, tasks };
  }

  write(fileName, writer) {
    writer(fileName, this.logs);
  }

  appendTask(bucketId, task) {
    const tasks = this.logs[bucketId].tasks;
    const taskId = task.details.taskId;
    tasks[taskId] = task.details;
  }

  append(newEntry) {
    const bucketId = newEntry.bucketId;
    this.logs[bucketId] = newEntry;
  }

  deleteBucket(bucketId) {
    delete this.logs[bucketId];
  }
}

module.exports = {
  TodoLogs
};
