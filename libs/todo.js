class Todo {
  constructor(newEntry, todoLogs) {
    this.bucketId = newEntry.bucketId;
    this.title = newEntry.title;
    this.todoItems = newEntry.todoItems;
    this.todoLogs = todoLogs;
  }
  static parseNewTask(text, generateId, bucketId) {
    const status = '';
    const taskId = generateId();
    const text = task;
    return { status, taskId, bucketId, text };
  }
  static parseNewEntry(parser, text, idGenerator) {
    const newEntry = { ...parser(`?${text}`, true).query };
    newEntry.bucketId = idGenerator();
    const parsedTask = parseNewTask(newEntry.task, idGenerator, bucketId);
  }
}
