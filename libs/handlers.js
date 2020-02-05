const fs = require('fs');
const { App } = require('./app.js');
const { loadTodoPage } = require('./viewTodoTemplate');
const { TodoLogs, Bucket } = require('./todo');
const { Task } = require('./task');
const STATIC_DIR = `${__dirname}/../public`;
const TODO_FILE = `${__dirname}/../docs/todos.json`;

const loadFile = function(filePath, encoding) {
  if (encoding) {
    return fs.readFileSync(filePath, encoding);
  }
  return fs.readFileSync(filePath);
};

const writeTo = function(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data));
};

const isFileNotAvailable = function(filePath) {
  const stats = fs.existsSync(filePath) && fs.statSync(filePath);
  return !stats || !stats.isFile();
};

const readBody = function(req, res, next) {
  let text = '';
  req.on('data', chunk => {
    text += chunk;
  });

  req.on('end', () => {
    req.body = text;
    next();
  });
};

const getCompleteUrl = function(url) {
  if (url === '/') {
    return `${STATIC_DIR}/index.html`;
  }
  return `${STATIC_DIR}${url}`;
};

const getFileExtension = function(fileName) {
  const fileExt = fileName.split('.').pop();
  return fileExt;
};

const loadOlderTodoLogs = function(todoFile) {
  if (!fs.existsSync(todoFile)) {
    writeTo(todoFile, {});
  }
  const todo = loadFile(todoFile);
  return JSON.parse(todo);
};

const generateGetResponse = function(url, res, body) {
  const fileExt = getFileExtension(url);
  res.setHeader('Content-Type', `text/${fileExt}`);
  res.write(body);
  res.end();
};

const loadStaticResponse = function(req, res, next) {
  const completeUrl = getCompleteUrl(req.url);
  if (isFileNotAvailable(completeUrl)) {
    next();
    return;
  }
  const body = loadFile(completeUrl);
  generateGetResponse(completeUrl, res, body);
};
const readTodoPage = function() {
  const allTodo = loadOlderTodoLogs(TODO_FILE);
  return loadTodoPage(allTodo, loadFile);
};

const serveTodoPage = function(req, res) {
  const completeUrl = getCompleteUrl(req.url);
  let mainPage = loadFile(completeUrl, 'utf8');
  const todoPage = readTodoPage();
  mainPage = mainPage.replace('__todoPage__', todoPage);
  generateGetResponse(completeUrl, res, mainPage);
};

//____________________________bucket handlers_________________________

const saveBucket = function(req, res) {
  const logs = loadOlderTodoLogs(TODO_FILE);
  const todoLogs = new TodoLogs(logs);
  const bucket = Bucket.parse(req.body);
  todoLogs.append(bucket);
  todoLogs.write(TODO_FILE, writeTo);
  const template = readTodoPage();
  res.end(template);
};

const deleteBucket = function(req, res) {
  const reqBody = JSON.parse(req.body);
  const logs = loadOlderTodoLogs(TODO_FILE);
  const todoLogs = new TodoLogs(logs);
  todoLogs.deleteBucket(reqBody.bucketId);
  todoLogs.write(TODO_FILE, writeTo);
  res.end(readTodoPage());
};

//____________________________task handlers_________________________

const handleTaskStatus = function(req, res) {
  const reqBody = JSON.parse(req.body);
  const logs = loadOlderTodoLogs(TODO_FILE);
  const todoLogs = new TodoLogs(logs);
  todoLogs.changeTaskStatus(reqBody.bucketId, reqBody.taskId);
  todoLogs.write(TODO_FILE, writeTo);
  res.end(readTodoPage());
};

const saveNewTask = function(req, res) {
  const reqBody = JSON.parse(req.body);
  const logs = loadOlderTodoLogs(TODO_FILE);
  const todoLogs = new TodoLogs(logs);
  const task = Task.parse(reqBody.bucketId, reqBody.task);
  todoLogs.appendTask(reqBody.bucketId, task);
  todoLogs.write(TODO_FILE, writeTo);
  res.end(readTodoPage());
};

const deleteTask = function(req, res) {
  const reqBody = JSON.parse(req.body);
  const logs = loadOlderTodoLogs(TODO_FILE);
  const todoLogs = new TodoLogs(logs);
  todoLogs.deleteTask(reqBody.bucketId, reqBody.taskId);
  todoLogs.write(TODO_FILE, writeTo);
  res.end(readTodoPage());
};

const notFound = function(req, res) {
  res.writeHead('404', 'NOT FOUND');
  res.end();
};
const methodNotAllowed = function(req, res) {
  res.writeHead('400', 'Method Not Allowed');
  res.end();
};

const app = new App();

app.use(readBody);
app.post('/saveTodo', saveBucket);
app.post('/setStatus', handleTaskStatus);
app.post('/deleteBucket', deleteBucket);
app.post('/deleteTask', deleteTask);
app.post('/saveNewTask', saveNewTask);
app.get('/', serveTodoPage);
app.get('/', loadStaticResponse);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
