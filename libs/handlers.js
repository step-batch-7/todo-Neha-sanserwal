const fs = require('fs');
const { parse } = require('url');
const { App } = require('./app.js');
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

const getRandomId = function() {
  return Math.random() * 10;
};

const parseEntryItem = function(bucketId, text) {
  const status = '';
  const taskId = getRandomId();
  return { status, taskId, bucketId, text };
};

const parseNewEntry = function(parser, text) {
  const todo = { ...parser(`?${text}`, true).query };
  let newEntry = {};
  newEntry.bucketId = getRandomId();
  newEntry.title = todo.title;
  newEntry.todoItems = [parseEntryItem(newEntry.bucketId, todo.task)];
  return newEntry;
};

const saveTodo = function(req, res, next) {
  const newEntry = parseNewEntry(parse, req.body);
  const todoLogs = loadOlderTodoLogs(TODO_FILE);
  todoLogs.unshift(newEntry);
  writeTo(TODO_FILE, todoLogs);
  res.writeHead('302', { location: '/' });
  res.end();
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

const collectTasks = function(todoList) {
  let listTemplate = loadFile('templates/taskTemplate.html', 'utf8');
  for (task of todoList) {
    for (const [key, value] of Object.entries(task)) {
      listTemplate = listTemplate.replace(`__${key}__`, value);
    }
  }
  return listTemplate;
};

const readTodoList = function(todoList) {
  let todoTemplate = loadFile('templates/todoTemplate.html', 'utf8');
  for (const [key, value] of Object.entries(todoList)) {
    if (key !== 'todoItems') {
      todoTemplate = todoTemplate.replace(`__${key}__`, value);
    } else {
      const allTasks = collectTasks(value);
      todoTemplate = todoTemplate.replace(`__${key}__`, allTasks);
    }
  }
  return todoTemplate;
};

const serveTodoPage = function(req, res, next) {
  const completeUrl = getCompleteUrl(req.url);
  let todoPage = loadFile(completeUrl, 'utf8');
  const allTodo = loadOlderTodoLogs(TODO_FILE);
  const todoTemplate = allTodo.map(readTodoList);
  todoPage = todoPage.replace('__todo__', todoTemplate.join('\n'));
  generateGetResponse(completeUrl, res, todoPage);
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
app.get('/', serveTodoPage);
app.post('/', saveTodo);
app.get('', loadStaticResponse);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
