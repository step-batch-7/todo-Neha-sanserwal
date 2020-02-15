const { loadTodoPage, readCards } = require('./viewTodoTemplate');
const { loadFile } = require('./fileOperators');
const { TodoLogs } = require('./todoLogs');
const { Session } = require('./session');

const readTodoPage = function(todoLogs) {
  const allTodo = todoLogs.getAllLogs();
  return loadTodoPage(allTodo, loadFile);
};

const serveTodoPage = function(req, res) {
  const todoPage = readTodoPage(req.todo);
  res.setHeader('content-type', 'text/html');
  res.end(todoPage);
};

const attachLocalsToReq = function(req, res, next) {
  req.data = req.app.locals.data;
  req.path = req.app.locals.path;
  req.writer = req.app.locals.writer;
  req.sessions = req.app.locals.sessions;
  next();
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
  req.writer(req.path, req.data);

  res.end(template);
};

const deleteBucket = function(req, res) {
  const { bucketId } = req.body;
  req.todo.deleteBucket(bucketId);
  const template = readTodoPage(req.todo);
  req.writer(req.path, req.data);
  res.end(template);
};

const editBucketTitle = function(req, res) {
  const { bucketId, title } = req.body;
  req.todo.editBucketTitle(bucketId, title);
  const template = readTodoPage(req.todo);
  req.writer(req.path, req.data);
  res.end(template);
};

//____________________________task handlers_________________________

const handleTaskStatus = function(req, res) {
  const { bucketId, taskId } = req.body;
  req.todo.changeTaskStatus(bucketId, taskId);
  const template = readTodoPage(req.todo);
  req.writer(req.path, req.data);
  res.end(template);
};

const saveNewTask = function(req, res) {
  const { bucketId, task } = req.body;
  req.todo.appendTask(bucketId, task);
  const template = readTodoPage(req.todo);
  req.writer(req.path, req.data);
  res.end(template);
};

const deleteTask = function(req, res) {
  const { bucketId, taskId } = req.body;
  req.todo.deleteTask(bucketId, taskId);
  const template = readTodoPage(req.todo);
  req.writer(req.path, req.data);
  res.end(template);
};

const editTask = function(req, res) {
  const { bucketId, taskId, text } = req.body;
  req.todo.editTask(bucketId, taskId, text);
  const template = readTodoPage(req.todo);
  req.writer(req.path, req.data);
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
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status('400').send('bad request');
  }
  if (username in req.data) {
    return res.status('400').send('userNameAlreadyExists');
  }
  next();
};

const registerUser = function(req, res, next) {
  const { username, password } = req.body;
  const lastId = 1000;
  req.data[username] = { username, password, todo: new TodoLogs({}, lastId) };
  req.writer(req.path, req.data);
  next();
};

const loginUser = function(req, res) {
  const { username, password } = req.body;
  const data = req.data;
  if (!(username in data)) {
    return res.status('400').send('invalidUserName');
  }
  if (data[username].password !== password) {
    return res.status('400').send('wrongPassword');
  }
  req.sessions[username] = Session.createSession(username);
  res.cookie('todo', req.sessions[username].currentSession).end();
};

const logOutUser = function(req, res) {
  const cookie = req.cookies.todo;
  if (!cookie) {
    return res.status('400').send('bad request');
  }
  const currentUser = cookie.user;
  delete req.sessions[currentUser];
  res.clearCookie('todo');
  res.redirect(307, '/');
};

const checkUserAccessability = function(req, res, next) {
  const cookie = req.cookies.todo;
  if (cookie && req.sessions[cookie.user].isEqualTo(cookie)) {
    return next();
  }
  res.status('400').send('Bad Request from login');
};

const loadUserData = function(req, res, next) {
  const user = req.cookies.todo.user;
  req.todo = req.data[user].todo;
  next();
};

module.exports = {
  attachLocalsToReq,
  registerUser,
  loginUser,
  logOutUser,
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
