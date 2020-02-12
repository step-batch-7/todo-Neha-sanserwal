const { loadTodoPage, readCards } = require('./viewTodoTemplate');
const {
  isFileNotAvailable,
  writeTo,
  loadFile,
  TODO_LOGS
} = require('./fileOperators');

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

const readTodoPage = function() {
  const allTodo = TODO_LOGS.getAllLogs();
  return loadTodoPage(allTodo, loadFile);
};

const serveTodoPage = function(req, res) {
  const todoPage = readTodoPage();
  res.setHeader('content-type', 'text/html');
  res.end(todoPage);
};

//____________________________bucket handlers_________________________

const saveBucket = function(req, res, path, next) {
  const { title } = req.body;
  if (!title) {
    next(path);
  }
  TODO_LOGS.append(title);
  TODO_LOGS.write(writeTo);
  const template = readTodoPage();
  res.end(template);
};

const deleteBucket = function(req, res, path, next) {
  const { bucketId } = req.body;
  if (!bucketId) {
    next(path);
  }
  TODO_LOGS.deleteBucket(bucketId);
  TODO_LOGS.write(writeTo);
  res.end(readTodoPage());
};

const editBucketTitle = function(req, res, path, next) {
  const { bucketId, title } = req.body;
  if (!bucketId || !title) {
    next(path);
  }
  TODO_LOGS.editBucketTitle(bucketId, title);
  TODO_LOGS.write(writeTo);
  res.end(readTodoPage());
};

//____________________________task handlers_________________________

const handleTaskStatus = function(req, res, path, next) {
  const { bucketId, taskId } = req.body;
  if (!bucketId || !taskId) {
    next(path);
  }
  TODO_LOGS.changeTaskStatus(bucketId, taskId);
  TODO_LOGS.write(writeTo);
  res.end(readTodoPage());
};

const saveNewTask = function(req, res, path, next) {
  const { bucketId, task } = req.body;
  if (!bucketId || !task) {
    next(path);
  }
  TODO_LOGS.appendTask(bucketId, task);
  TODO_LOGS.write(writeTo);
  res.end(readTodoPage());
};

const deleteTask = function(req, res, path, next) {
  const { bucketId, taskId } = req.body;
  if (!bucketId || !taskId) {
    next(path);
  }
  TODO_LOGS.deleteTask(bucketId, taskId);
  TODO_LOGS.write(writeTo);
  res.end(readTodoPage());
};

const editTask = function(req, res, path, next) {
  const { bucketId, taskId, text } = req.body;
  if (!bucketId || !taskId || !text) {
    next(path);
  }
  TODO_LOGS.editTask(bucketId, taskId, text);
  TODO_LOGS.write(writeTo);
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

const search = function(req, res) {
  const { text, searchBy } = req.body;
  if (text === '') {
    res.end(readTodoPage());
  }
  if (searchBy === 'Title') {
    const searchedLogs = TODO_LOGS.searchTitle(text);
    const cards = readCards(searchedLogs, loadFile);
    res.end(cards);
  }
  const searchedLogs = TODO_LOGS.searchTask(text);
  const cards = readCards(searchedLogs, loadFile);
  res.end(cards);
};
module.exports = {
  search,
  parseBody,
  readBody,
  loadStaticResponse,
  saveBucket,
  saveNewTask,
  deleteBucket,
  deleteTask,
  editTask,
  notFound,
  methodNotAllowed,
  editBucketTitle,
  handleTaskStatus,
  serveTodoPage
};
