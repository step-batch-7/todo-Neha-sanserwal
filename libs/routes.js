const handlers = require('./handlers');
const { App } = require('./app');
const app = new App();

app.use(handlers.readBody);
app.post('/saveTodo', handlers.saveBucket);
app.post('/setStatus', handlers.handleTaskStatus);
app.post('/deleteBucket', handlers.deleteBucket);
app.post('/deleteTask', handlers.deleteTask);
app.post('/saveNewTask', handlers.saveNewTask);
app.post('/editTitle', handlers.editBucketTitle);
app.post('/editTask', handlers.editTask);
app.post('/search', handlers.search);
app.get('/index.html', handlers.serveTodoPage);
app.get('/', handlers.loadStaticResponse);
app.get('', handlers.notFound);
app.use(handlers.methodNotAllowed);

const handleRequest = function(req, res) {
  app.serve(req, res);
};

module.exports = { handleRequest };
