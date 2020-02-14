const { loadTodoPage, readCards } = require('./viewTodoTemplate');
const { writeToFile, loadFile } = require('./fileOperators');
const { TodoLogs } = require('./todoLogs');

const readTodoPage = function(todoLogs) {
  const allTodo = todoLogs.getAllLogs();
  return loadTodoPage(allTodo, loadFile);
};
const serveTodoPage = function(req, res) {
  const todoPage = readTodoPage(req.todo);
  res.end(todoPage);
};

//____________________________bucket handlers_________________________

const hasOptions = function(...args) {
  return function(req, res, next) {
    for (const opt of args) {
      if (!(opt in req.body)) {
        return res.status('400').send('bad req');
      }
    }
    next();
  };
};

const saveBucket = function(req, res) {
  const { title } = req.body;
  req.todo.append(title);
  const template = readTodoPage(req.todo);
  writeToFile(req.app.locals.path, req.app.locals.data);

  res.end(template);
};

const deleteBucket = function(req, res) {
  const { bucketId } = req.body;
  req.todo.deleteBucket(bucketId);
  const template = readTodoPage(req.todo);
  writeToFile(req.app.locals.path, req.app.locals.data);
  res.end(template);
};

const editBucketTitle = function(req, res) {
  const { bucketId, title } = req.body;
  req.todo.editBucketTitle(bucketId, title);
  const template = readTodoPage(req.todo);
  writeToFile(req.app.locals.path, req.app.locals.data);
  res.end(template);
};

//____________________________task handlers_________________________

const handleTaskStatus = function(req, res, path, next) {
  const { bucketId, taskId } = req.body;
  if (!bucketId || !taskId) {
    next(path);
  }
  const todoFile = `${path}${req.username}.json`;
  const todoLogs = getTodoLogs(todoFile);
  todoLogs.changeTaskStatus(bucketId, taskId);
  todoLogs.write(todoFile, writeToFile);
  res.end(readTodoPage(todoLogs));
};

const saveNewTask = function(req, res, path, next) {
  const { bucketId, task } = req.body;
  if (!bucketId || !task) {
    next(path);
  }
  const todoFile = `${path}${req.username}.json`;
  const todoLogs = getTodoLogs(todoFile);
  todoLogs.appendTask(bucketId, task);
  todoLogs.write(todoFile, writeToFile);
  res.end(readTodoPage(todoLogs));
};

const deleteTask = function(req, res, path, next) {
  const { bucketId, taskId } = req.body;
  if (!bucketId || !taskId) {
    next(path);
  }
  const todoFile = `${path}${req.username}.json`;
  const todoLogs = getTodoLogs(todoFile);
  todoLogs.deleteTask(bucketId, taskId);
  todoLogs.write(todoFile, writeToFile);
  res.end(readTodoPage(todoLogs));
};

const editTask = function(req, res, path, next) {
  const { bucketId, taskId, text } = req.body;
  if (!bucketId || !taskId || !text) {
    next(path);
  }
  const todoFile = `${path}${req.username}.json`;
  const todoLogs = getTodoLogs(todoFile);
  todoLogs.editTask(bucketId, taskId, text);
  todoLogs.write(todoFile, writeToFile);
  res.end(readTodoPage(todoLogs));
};

const notFound = function(req, res) {
  res.writeHead('404', 'NOT FOUND');
  res.end();
};
const methodNotAllowed = function(req, res) {
  res.writeHead('400', 'Method Not Allowed');
  res.end();
};

const search = function(req, res, path, next) {
  const { text, searchBy } = req.body;
  if (text === '') {
    res.end(readTodoPage(todoLogs));
  }
  const todoFile = `${path}${req.username}.json`;
  const todoLogs = getTodoLogs(todoFile);
  if (searchBy === 'Title') {
    const cards = readCards(todoLogs.searchTitle(text), loadFile);
    res.end(cards);
  }
  const cards = readCards(todoLogs.searchTask(text), loadFile);
  res.end(cards);
};

//________________________________auth__________________________
const checkAuthDetails = function(req, res, next) {
  const data = req.app.locals.data;
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('bad request');
  }
  if (username in data) {
    return res.status(400).send('userNameAlreadyExists');
  }
  next();
};

const registerUser = function(req, res, next) {
  const data = req.app.locals.data;
  const { username, password } = req.body;
  data[username] = { username, password, todo: {} };
  writeToFile(req.app.locals.path, data);
  next();
};

const loginUser = function(req, res, next) {
  const { username, password } = req.body;
  const data = req.app.locals.data;
  if (!(username in data)) {
    return res.status('400').send('invalidUserName');
  }
  res.cookie('user', username).end();
};

const checkUserAccessability = function(req, res, next) {
  const data = req.app.locals.data;
  const cookie = req.cookies;
  if (cookie.user in data) {
    return next();
  }
  res.status('400').send('Bad Request');
};

const loadUserData = function(req, res, next) {
  const user = req.cookies.user;
  req.todo = req.app.locals.data[user].todo;
  next();
};

module.exports = {
  registerUser,
  loginUser,
  checkAuthDetails,
  checkUserAccessability,
  loadUserData,
  hasOptions,
  serveTodoPage,
  saveBucket,
  saveNewTask,
  deleteBucket,
  deleteTask,
  editTask,
  notFound,
  methodNotAllowed,
  editBucketTitle,
  handleTaskStatus,
  search
};
