const handlers = require('./handlers');
const { App } = require('./app');

const attachMiddlerWare = function(app) {
  app.use(handlers.readBody);
  app.use(handlers.parseBody);
  app.use(handlers.parseCookie);
  app.use(handlers.authenticateReq);
};

const attachAuthHandlers = function(app) {
  app.post('/login', handlers.loginUser);
  app.post('/signup', handlers.registerUser);
  app.post('/signup', handlers.loginUser);
};

const attachPostHandlers = function(app) {
  app.post('/saveTodo', handlers.saveBucket);
  app.post('/setStatus', handlers.handleTaskStatus);
  app.post('/deleteBucket', handlers.deleteBucket);
  app.post('/deleteTask', handlers.deleteTask);
  app.post('/saveNewTask', handlers.saveNewTask);
  app.post('/editTitle', handlers.editBucketTitle);
  app.post('/editTask', handlers.editTask);
  app.post('/search', handlers.search);
};
const attachGetHandlers = function(app) {
  app.get('/todo', handlers.serveTodoPage);
  app.get('/', handlers.loadStaticResponse);
  app.get('', handlers.notFound);
};

const handleRequest = function(req, res) {
  const app = new App(this['data_store']);
  attachMiddlerWare(app);
  attachAuthHandlers(app);
  attachPostHandlers(app);
  attachGetHandlers(app);
  app.use(handlers.methodNotAllowed);
  app.serve(req, res);
};

module.exports = { handleRequest };
