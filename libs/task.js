const getRandomId = function() {
  const range = 10;
  const randomId = Math.random() * Math.pow(range, range);
  return Math.floor(randomId);
};
class Task {
  constructor(newTask) {
    this.item = { ...newTask };
  }
  static parseEntryItem(bucketId, text) {
    const status = '';
    const taskId = getRandomId();
    const task = { status, taskId, bucketId, text };
    return { [taskId]: task };
  }
  get details() {
    const [taskData] = Object.values(this.item);
    return taskData;
  }
}
module.exports = { Task };
