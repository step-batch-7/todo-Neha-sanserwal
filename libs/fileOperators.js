const fs = require('fs');
const { TodoLogs } = require('../libs/todoLogs');
const TODO_FILE = `${__dirname}/../docs/todos.json`;

const writeToFile = function(path, data) {
  fs.writeFileSync(path, JSON.stringify(data));
};

const loadFile = function(filePath, encoding) {
  if (encoding) {
    return fs.readFileSync(filePath, encoding);
  }
  return fs.readFileSync(filePath);
};

const writeTo = function(data) {
  fs.writeFileSync(TODO_FILE, JSON.stringify(data));
};

const isFileNotAvailable = function(filePath) {
  const stats = fs.existsSync(filePath) && fs.statSync(filePath);
  return !stats || !stats.isFile();
};

const loadOlderTodoLogs = function(todoFile) {
  if (!fs.existsSync(todoFile)) {
    writeTo({});
  }
  const todo = loadFile(todoFile, 'utf8');
  return JSON.parse(todo);
};

const TODO_LOGS = TodoLogs.parse(loadOlderTodoLogs(TODO_FILE));

module.exports = {
  loadOlderTodoLogs,
  TODO_LOGS,
  isFileNotAvailable,
  writeTo,
  writeToFile,
  loadFile
};
