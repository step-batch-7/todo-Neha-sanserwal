const getRandomId = function() {
  const randomId = Math.random() * Math.pow(10, 10);
  return Math.floor(randomId);
};
class Todo {
  constructor(newEntry, logs) {
    this.newEntry = { ...newEntry };
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

  appendTo(file, writer) {
    const bucketId = this.newEntry.bucketId;
    this.logs[bucketId] = this.newEntry;
    writer(file, this.logs);
  }
}

module.exports = {
  Todo
};
