const getRandomId = function() {
  const range = 10;
  const randomId = Math.random() * Math.pow(range, range);
  return Math.floor(randomId);
};
class TodoLogs {
  constructor(logs) {
    this.logs = logs;
  }

  static parseEntryItem(newEntry) {
    const status = '';
    const taskId = getRandomId();
    const bucketId = newEntry.bucketId;
    const text = newEntry.task;
    const task = { status, taskId, bucketId, text };
    return { [taskId]: task };
  }

  static parseNewEntry(text) {
    const newEntry = JSON.parse(text);
    newEntry.bucketId = getRandomId();
    newEntry.tasks = { ...this.parseEntryItem(newEntry) };
    return newEntry;
  }

  appendAndWrite(file, writer, newEntry) {
    const bucketId = newEntry.bucketId;
    this.logs[bucketId] = newEntry;
    writer(file, this.logs);
  }
}

module.exports = {
  TodoLogs
};
