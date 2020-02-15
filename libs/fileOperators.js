const fs = require('fs');
const { TodoLogs } = require('../libs/todoLogs');

const writeToFile = function(path, data) {
  fs.writeFileSync(path, JSON.stringify(data));
};

const loadFile = function(filePath, encoding) {
  if (encoding) {
    return fs.readFileSync(filePath, encoding);
  }
  return fs.readFileSync(filePath);
};

const loadData = function(path) {
  if (!fs.existsSync(path)) {
    writeToFile(path, {});
  }
  const data = JSON.parse(loadFile(path, 'utf8'));
  for (const user in data) {
    data[user].todo = TodoLogs.parse(data[user].todo.logs);
  }
  return data;
};

module.exports = {
  writeToFile,
  loadData,
  loadFile
};
