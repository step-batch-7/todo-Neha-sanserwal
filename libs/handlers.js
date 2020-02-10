const { App } = require('./app.js');
const { loadTodoPage, readCards } = require('./viewTodoTemplate');
const { TodoLogs, Bucket } = require('./todo');

const {
  loadOlderTodoLogs,
  isFileNotAvailable,
  writeTo,
  loadFile
} = require('./fileOperators');

const STATIC_DIR = `${__dirname}/../public`;
const TODO_FILE = `${__dirname}/../docs/todos.json`;
const TODO_LOGS = TodoLogs.parse(loadOlderTodoLogs(TODO_FILE));

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
  const reqBody = JSON.parse(req.body);
  const bucket = Bucket.parse(reqBody.title, TODO_LOGS.newBucketId);
  TODO_LOGS.append(bucket);
  TODO_LOGS.write(TODO_FILE, writeTo);
  const template = readTodoPage();
  res.end(template);
};

const deleteBucket = function(req, res) {
  const reqBody = JSON.parse(req.body);
  TODO_LOGS.deleteBucket(reqBody.bucketId);
  TODO_LOGS.write(TODO_FILE, writeTo);
  res.end(readTodoPage());
};

const editBucketTitle = function(req, res) {
  const reqBody = JSON.parse(req.body);
  TODO_LOGS.editBucketTitle(reqBody.bucketId, reqBody.title);
  TODO_LOGS.write(TODO_FILE, writeTo);
  res.end(readTodoPage());
};

//____________________________task handlers_________________________

const handleTaskStatus = function(req, res) {
  const reqBody = JSON.parse(req.body);
  TODO_LOGS.changeTaskStatus(reqBody.bucketId, reqBody.taskId);
  TODO_LOGS.write(TODO_FILE, writeTo);
  res.end(readTodoPage());
};

const saveNewTask = function(req, res) {
  const reqBody = JSON.parse(req.body);
  TODO_LOGS.appendTask(reqBody.bucketId, reqBody.task);
  TODO_LOGS.write(TODO_FILE, writeTo);
  res.end(readTodoPage());
};

const deleteTask = function(req, res) {
  const reqBody = JSON.parse(req.body);
  TODO_LOGS.deleteTask(reqBody.bucketId, reqBody.taskId);
  TODO_LOGS.write(TODO_FILE, writeTo);
  res.end(readTodoPage());
};

const editTask = function(req, res) {
  const { bucketId, taskId, text } = JSON.parse(req.body);
  TODO_LOGS.editTask(bucketId, taskId, text);
  TODO_LOGS.write(TODO_FILE, writeTo);
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

const app = new App();

app.use(readBody);
app.post('/saveTodo', saveBucket);
app.post('/setStatus', handleTaskStatus);
app.post('/deleteBucket', deleteBucket);
app.post('/deleteTask', deleteTask);
app.post('/saveNewTask', saveNewTask);
app.post('/editTitle', editBucketTitle);
app.post('/editTask', editTask);
app.post('/search', search);
app.get('/', serveTodoPage);
app.get('/', loadStaticResponse);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
