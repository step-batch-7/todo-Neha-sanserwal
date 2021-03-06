class Task {
  constructor(status, bucketId, taskId, text) {
    this.status = status;
    this.bucketId = bucketId;
    this.taskId = taskId;
    this.text = text;
  }

  static parse(bucketId, id, text) {
    const status = '';
    const taskId = id;
    return new Task(status, bucketId, taskId, text);
  }

  toggleStatus() {
    if (this.status === 'checked') {
      this.status = '';
      return;
    }
    this.status = 'checked';
  }

  change(text) {
    this.text = text;
  }
  toJSON() {
    return {
      status: this.status,
      bucketId: this.bucketId,
      taskId: this.taskId,
      text: this.text
    };
  }
}
module.exports = { Task };
