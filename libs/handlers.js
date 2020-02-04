const fs = require('fs');
const { App } = require('./app.js');
const { loadTodoTemplate } = require('./viewTodoTemplate');
const { Todo } = require('./todo');
const STATIC_DIR = `${__dirname}/../public`;
const TODO_FILE = `${__dirname}/../docs/todos.json`;

const getFileExtension = function(fileName) {
  const fileExt = fileName.split('.').pop();
  return fileExt;
};
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

const loadOlderTodoLogs = function(todoFile) {
  if (!fs.existsSync(todoFile)) {
    writeTo(todoFile, []);
  }
  const todo = loadFile(todoFile);
  return JSON.parse(todo);
};

const saveTodo = function(req, res, next) {
  let todoLogs = loadOlderTodoLogs(TODO_FILE);
  const newEntry = Todo.parseNewEntry(req.body);
  newTodo = new Todo(newEntry, todoLogs);
  newTodo.appendTo(TODO_FILE, writeTo);
  let template = loadTodoPage();
  res.end(template);
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
    return next();
  }
  const body = loadFile(completeUrl);
  generateGetResponse(completeUrl, res, body);
};

const loadTodoPage = function() {
  const allTodo = loadOlderTodoLogs(TODO_FILE);
  return loadTodoTemplate(allTodo, loadFile);
};

const serveTodoPage = function(req, res) {
  const completeUrl = getCompleteUrl(req.url);
  let mainPage = loadFile(completeUrl, 'utf8');
  const todoPage = loadTodoPage(completeUrl);
  mainPage = mainPage.replace('__todoPage__', todoPage);
  generateGetResponse(completeUrl, res, mainPage);
};

const notFound = function(req, res) {
  res.writeHead('404', 'NOT FOUND');
  res.end();
};
const methodNotAllowed = function(req, res) {
  res.writeHead('400', 'Method Not Allowed');
  res.end();
};

const reverseStatus = function(status) {
  if (status === 'checked') {
    return '';
  }
  return 'checked';
};

const setStatus = function(list, taskId) {
  for (task of list) {
    if (task.taskId === taskId) {
      task.status = reverseStatus(task.status);
      return;
    }
  }
};
const handleTaskStatus = function(req, res) {
  let reqBody = JSON.parse(req.body);
  const todoLogs = loadOlderTodoLogs(TODO_FILE);
  const todoTemplate = loadTodoTemplate(todoLogs, loadFile);
  for (todo of todoLogs) {
    if (todo.bucketId === reqBody.bucketId) {
      setStatus(todo.todoItems, reqBody.taskId);
    }
  }
  writeTo(TODO_FILE, todoLogs);
  res.end(todoTemplate.join('\n'));
};

const app = new App();

app.use(readBody);
app.post('/saveTodo', saveTodo);
app.post('/setStatus', handleTaskStatus);
app.get('/', serveTodoPage);
app.get('', loadStaticResponse);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
