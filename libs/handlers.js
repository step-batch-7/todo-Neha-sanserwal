const fs = require('fs');
const { App } = require('./app.js');
const { loadTodoPage } = require('./viewTodoTemplate');
const { TodoLogs } = require('./todo');
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

const saveTodo = function(req, res) {
  const todoLogs = loadOlderTodoLogs(TODO_FILE);
  const newTodo = new TodoLogs(todoLogs);
  const newEntry = TodoLogs.parseNewEntry(req.body);
  newTodo.appendAndWrite(TODO_FILE, writeTo, newEntry);
  const template = readTodoPage();
  res.end(template);
};

const deleteBucket = function(req, res) {
  const reqBody = JSON.parse(req.body);
  const todoLogs = loadOlderTodoLogs(TODO_FILE);
  const bucketId = reqBody.bucketId;
  delete todoLogs[bucketId];
  writeTo(TODO_FILE, todoLogs);
  res.end(readTodoPage());
};

//____________________________task handlers_________________________

const toggleStatus = function(status) {
  if (status === 'checked') {
    return '';
  }
  return 'checked';
};
const handleTaskStatus = function(req, res) {
  const reqBody = JSON.parse(req.body);
  const todoLogs = loadOlderTodoLogs(TODO_FILE);
  const bucket = todoLogs[reqBody.bucketId];
  const task = bucket.tasks[reqBody.taskId];
  task.status = toggleStatus(task.status);
  writeTo(TODO_FILE, todoLogs);
  res.end(readTodoPage());
};

const saveNewTask = function(req, res) {
  const reqBody = JSON.parse(req.body);
  const todoLogs = loadOlderTodoLogs(TODO_FILE);
  const bucket = todoLogs[reqBody.bucketId].tasks;
  const newEntry = TodoLogs.parseEntryItem(reqBody);
  const [task] = Object.values(newEntry);
  const taskId = task.taskId;
  bucket[taskId] = task;
  writeTo(TODO_FILE, todoLogs);
  res.end(readTodoPage());
};

const deleteTask = function(req, res) {
  const reqBody = JSON.parse(req.body);
  const todoLogs = loadOlderTodoLogs(TODO_FILE);
  const bucket = todoLogs[reqBody.bucketId];
  const tasks = bucket.tasks;
  delete tasks[reqBody.taskId];
  writeTo(TODO_FILE, todoLogs);
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
app.post('/saveTodo', saveTodo);
app.post('/setStatus', handleTaskStatus);
app.post('/deleteBucket', deleteBucket);
app.post('/deleteTask', deleteTask);
app.post('/saveNewTask', saveNewTask);
app.get('/', serveTodoPage);
app.get('/', loadStaticResponse);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
