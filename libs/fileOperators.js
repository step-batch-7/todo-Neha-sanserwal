const fs = require('fs');

const writeToFile = function(path, data) {
  fs.writeFileSync(path, JSON.stringify(data));
};

const loadFile = function(filePath, encoding) {
  if (encoding) {
    return fs.readFileSync(filePath, encoding);
  }
  return fs.readFileSync(filePath);
};

const isFileNotAvailable = function(filePath) {
  const stats = fs.existsSync(filePath) && fs.statSync(filePath);
  return !stats || !stats.isFile();
};

const loadOlderTodoLogs = function(todoFile) {
  if (!fs.existsSync(todoFile)) {
    writeToFile(todoFile, {});
  }
  const todo = loadFile(todoFile, 'utf8');
  return JSON.parse(todo);
};

module.exports = {
  loadOlderTodoLogs,
  isFileNotAvailable,
  writeToFile,
  loadFile
};
