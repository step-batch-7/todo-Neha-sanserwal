const { loadTodoPage, readCards } = require('./viewTodoTemplate');
const {
  loadOlderTodoLogs,
  isFileNotAvailable,
  writeToFile,
  loadFile
} = require('./fileOperators');
const { TodoLogs } = require('./todoLogs');
const STATIC_DIR = `${__dirname}/../public`;
const readBody = function(req, res, path, next) {
  let text = '';
  req.on('data', chunk => {
    text += chunk;
  });

  req.on('end', () => {
    req.body = text;
    next(path);
  });
};

const parseBody = function(req, res, path, next) {
  const { headers } = req;
  if (headers['content-type'] === 'application/json') {
    req.body = JSON.parse(req.body);
  }
  return next(path);
};

const parseCookie = function(req, res, path, next) {
  const cookie = req.headers.cookie;
  if (cookie) {
    req.username = cookie.split('=').pop();
  }
  return next(path);
};

const authenticateReq = function(req, res, path, next) {
  const authentications = JSON.parse(loadFile(`${path}auth.json`, 'utf8'));
  const validUrls = [
    '/',
    '/css/app.css',
    '/js/xhr.js',
    '/css/login.css',
    '/js/changeContents.js',
    '/css/index.css',
    '/favicon.ico'
  ];
  const isValidUser = req.username in authentications;
  if (isValidUser || validUrls.includes(req.url)) {
    return next(path);
  }
  res.statusCode = 400;
  res.end();
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

const generateGetResponse = function(url, res, path, body) {
  const fileExt = getFileExtension(url);
  res.setHeader('Content-Type', `text/${fileExt}`);
  res.write(body);
  res.end();
};

const loadStaticResponse = function(req, res, path, next) {
  const completeUrl = getCompleteUrl(req.url);
  if (isFileNotAvailable(completeUrl)) {
    next(path);
    return;
  }
  const body = loadFile(completeUrl);
  generateGetResponse(completeUrl, res, path, body);
};

const readTodoPage = function(todoLogs) {
  const allTodo = todoLogs.getAllLogs();
  return loadTodoPage(allTodo, loadFile);
};
const getTodoLogs = function(todoFile) {
  const logs = loadOlderTodoLogs(todoFile);
  return TodoLogs.parse(logs);
};
const serveTodoPage = function(req, res, path) {
  const todoFile = `${path}${req.username}.json`;
  const todoLogs = getTodoLogs(todoFile);
  const todoPage = readTodoPage(todoLogs);
  res.setHeader('content-type', 'text/html');
  res.end(todoPage);
};

//____________________________bucket handlers_________________________

const saveBucket = function(req, res, path, next) {
  const { title } = req.body;
  if (!title) {
    next(path);
  }
  const todoFile = `${path}${req.username}.json`;
  const todoLogs = getTodoLogs(todoFile);
  todoLogs.append(title);
  const template = readTodoPage(todoLogs);
  todoLogs.write(todoFile, writeToFile);
  res.end(template);
};

const deleteBucket = function(req, res, path, next) {
  const { bucketId } = req.body;
  if (!bucketId) {
    next(path);
  }
  const todoFile = `${path}${req.username}.json`;
  const todoLogs = getTodoLogs(todoFile);
  todoLogs.deleteBucket(bucketId);
  todoLogs.write(todoFile, writeToFile);
  res.end(readTodoPage(todoLogs));
};

const editBucketTitle = function(req, res, path, next) {
  const { bucketId, title } = req.body;
  if (!bucketId || !title) {
    next(path);
  }
  const todoFile = `${path}${req.username}.json`;
  const todoLogs = getTodoLogs(todoFile);
  todoLogs.editBucketTitle(bucketId, title);
  todoLogs.write(todoFile, writeToFile);
  res.end(readTodoPage(todoLogs));
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

const registerUser = function(req, res, path, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(path);
  }
  const authentications = JSON.parse(loadFile(`${path}auth.json`, 'utf8'));
  if (username in authentications) {
    res.statusCode = 400;
    return res.end('userNameAlreadyExists');
  }
  authentications[username] = { username, password };
  writeToFile(`${path}auth.json`, authentications);
  next(path);
};

const loginUser = function(req, res, path, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(path);
  }
  const authentications = JSON.parse(loadFile(`${path}auth.json`, 'utf8'));
  if (!(username in authentications)) {
    res.statusCode = 400;
    return res.end('invalidUserName');
  }
  res.setHeader('set-cookie', `user=${username}`);
  res.end();
};

module.exports = {
  parseBody,
  readBody,
  parseCookie,
  authenticateReq,
  registerUser,
  loginUser,
  loadStaticResponse,
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
