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

const handleTaskStatus = function(req, res) {
  const { bucketId, taskId } = req.body;
  req.todo.changeTaskStatus(bucketId, taskId);
  const template = readTodoPage(req.todo);
  writeToFile(req.app.locals.path, req.app.locals.data);
  res.end(template);
};

const saveNewTask = function(req, res) {
  const { bucketId, task } = req.body;
  req.todo.appendTask(bucketId, task);
  const template = readTodoPage(req.todo);
  writeToFile(req.app.locals.path, req.app.locals.data);
  res.end(template);
};

const deleteTask = function(req, res) {
  const { bucketId, taskId } = req.body;
  req.todo.deleteTask(bucketId, taskId);
  const template = readTodoPage(req.todo);
  writeToFile(req.app.locals.path, req.app.locals.data);
  res.end(template);
};

const editTask = function(req, res) {
  const { bucketId, taskId, text } = req.body;
  req.todo.editTask(bucketId, taskId, text);
  const template = readTodoPage(req.todo);
  writeToFile(req.app.locals.path, req.app.locals.data);
  res.end(template);
};

const search = function(req, res) {
  const { text, searchBy } = req.body;
  if (text === '') {
    res.end(readTodoPage(req.todo));
  }
  if (searchBy === 'Title') {
    const cards = readCards(req.todo.searchTitle(text), loadFile);
    res.end(cards);
  }
  const cards = readCards(req.todo.searchTask(text), loadFile);
  res.end(cards);
};

//________________________________auth__________________________
const checkAuthDetails = function(req, res, next) {
  const data = req.app.locals.data;
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status('400').send('bad request');
  }
  if (username in data) {
    return res.status('400').send('userNameAlreadyExists');
  }
  next();
};

const registerUser = function(req, res, next) {
  const data = req.app.locals.data;
  const { username, password } = req.body;
  const lastId = 1000;
  data[username] = { username, password, todo: new TodoLogs({}, lastId) };
  writeToFile(req.app.locals.path, data);
  next();
};

const loginUser = function(req, res) {
  const { username, password } = req.body;
  const data = req.app.locals.data;
  if (!(username in data)) {
    return res.status('400').send('invalidUserName');
  }
  if (data[username].password !== password) {
    return res.status('400').send('wrongPassword');
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
  editBucketTitle,
  handleTaskStatus,
  search
};
