const { loadTodoPage, readCards } = require('./viewTodoTemplate');
const {
  isFileNotAvailable,
  writeTo,
  loadFile,
  TODO_LOGS
} = require('./fileOperators');

const STATIC_DIR = `${__dirname}/../public`;

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
  const allTodo = TODO_LOGS.getAllLogs();
  return loadTodoPage(allTodo, loadFile);
};

const serveTodoPage = function(req, res) {
  const todoPage = readTodoPage();
  res.setHeader('content-type', 'text/html');
  res.end(todoPage);
};

//____________________________bucket handlers_________________________

const saveBucket = function(req, res, next) {
  const reqBody = JSON.parse(req.body);
  if (!reqBody.title) {
    next();
  }
  TODO_LOGS.append(reqBody.title);
  TODO_LOGS.write(writeTo);
  const template = readTodoPage();
  res.end(template);
};

const deleteBucket = function(req, res, next) {
  const reqBody = JSON.parse(req.body);
  if (!reqBody.bucketId) {
    next();
  }
  TODO_LOGS.deleteBucket(reqBody.bucketId);
  TODO_LOGS.write(writeTo);
  res.end(readTodoPage());
};

const editBucketTitle = function(req, res, next) {
  const reqBody = JSON.parse(req.body);
  if (!reqBody.bucketId) {
    next();
  }
  TODO_LOGS.editBucketTitle(reqBody.bucketId, reqBody.title);
  TODO_LOGS.write(writeTo);
  res.end(readTodoPage());
};

//____________________________task handlers_________________________

const handleTaskStatus = function(req, res) {
  const reqBody = JSON.parse(req.body);
  TODO_LOGS.changeTaskStatus(reqBody.bucketId, reqBody.taskId);
  TODO_LOGS.write(writeTo);
  res.end(readTodoPage());
};

const saveNewTask = function(req, res, next) {
  const reqBody = JSON.parse(req.body);
  if (!reqBody.bucketId || !reqBody.task) {
    next();
  }
  TODO_LOGS.appendTask(reqBody.bucketId, reqBody.task);
  TODO_LOGS.write(writeTo);
  res.end(readTodoPage());
};

const deleteTask = function(req, res) {
  const reqBody = JSON.parse(req.body);
  TODO_LOGS.deleteTask(reqBody.bucketId, reqBody.taskId);
  TODO_LOGS.write(writeTo);
  res.end(readTodoPage());
};

const editTask = function(req, res) {
  const { bucketId, taskId, text } = JSON.parse(req.body);
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
  const reqBody = JSON.parse(req.body);
  if (reqBody.text === '') {
    res.end(readTodoPage());
  }
  if (reqBody.searchBy === 'Title') {
    const searchedLogs = TODO_LOGS.searchTitle(reqBody.text);
    const cards = readCards(searchedLogs, loadFile);
    res.end(cards);
  }
  const searchedLogs = TODO_LOGS.searchTask(reqBody.text);
  const cards = readCards(searchedLogs, loadFile);
  res.end(cards);
};
module.exports = {
  search,
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
