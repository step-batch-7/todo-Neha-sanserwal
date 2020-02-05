const getRandomId = function() {
  const range = 10;
  const randomId = Math.random() * Math.pow(range, range);
  return Math.floor(randomId);
};
class Task {
  constructor(status, bucketId, taskId, text) {
    this.status = status;
    this.bucketId = bucketId;
    this.taskId = taskId;
    this.text = text;
  }
  static parse(bucketId, text) {
    const status = '';
    const taskId = getRandomId();
    return new Task(status, bucketId, taskId, text);
  }
  get details() {
    const [taskData] = Object.values(this.item);
    return taskData;
  }
}
module.exports = { Task };
