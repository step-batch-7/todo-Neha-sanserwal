const request = require('supertest');
const app = require('../libs/app');
const fs = require('fs');
const sinon = require('sinon');
const { TODO_LOGS } = require('../libs/fileOperators');

describe('GET request', function() {
  before(() => {
    sinon.replace(fs, 'existsSync', () => {
      return true;
    });
    sinon.replace(fs, 'readFileSync', () => {
      return '{}';
    });
  });
  describe('homePage', function() {
    it('should serveTodo when the route is /', function(done) {
      request(app)
        .get('/')
        .expect('Content-type', 'text/html; charset=UTF-8')
        .expect(200, done);
    });
    it('should serveTodo when the route is /todo and cookie is set', done => {
      request(app)
        .get('/user/todo')
        .set('cookie', 'user=john')
        .expect('content-type', 'text/html')
        .expect(200, done);
    });
  });
  it('should load css when browser ask for it', function(done) {
    request(app)
      .get('/css/app.css')
      .expect('Content-type', 'text/css; charset=UTF-8')
      .expect(200, done);
  });
  it('should load js files when browser ask for it', function(done) {
    request(app)
      .get('/js/changeContents.js')
      .expect('Content-type', 'application/javascript; charset=UTF-8')
      .expect(200, done);
  });
  after(() => {
    sinon.restore();
  });
});

describe('Bad request', function() {
  it('should not allow methods on page which are not allowed', function(done) {
    request(app)
      .put('/')
      .send({ name: 'john' })
      .expect(400, done);
  });
});

describe('file not found', function() {
  it('should give error if path is not found', function(done) {
    request(app)
      .get('/abc')
      .expect(404, done);
  });
});

describe('POST request', function() {
  describe('saveTodo', function() {
    it('should post the todo', function(done) {
      sinon.stub(TODO_LOGS, 'append');
      request(handleRequest)
        .post('/saveTodo')
        .send({ title: 'class' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it('should give bad request when title is not given', function(done) {
      request(handleRequest)
        .post('/saveTodo')
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });

  describe('deleteBucket', function() {
    it(' should delete a todo', function(done) {
      sinon.stub(TODO_LOGS, 'deleteBucket');
      request(handleRequest)
        .post('/deleteBucket')
        .send({ bucketId: 1000 })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId is not given', function(done) {
      request(handleRequest)
        .post('/deleteBucket')
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });
  describe('editTitle', function() {
    it('should edit the title of given todoId', done => {
      sinon.stub(TODO_LOGS, 'editBucketTitle');
      request(handleRequest)
        .post('/editTitle')
        .send({ bucketId: 1000, title: 'office' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId is not given', function(done) {
      request(handleRequest)
        .post('/editTitle')
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });
  describe('saveNewTask', function() {
    it('should save the given task', done => {
      sinon.stub(TODO_LOGS, 'appendTask');
      request(handleRequest)
        .post('/saveNewTask')
        .send({ bucketId: 1000, task: 'hello' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId is not given', function(done) {
      request(handleRequest)
        .post('/saveNewTask')
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
    it(' should give bad request when task is not given', function(done) {
      request(handleRequest)
        .post('/saveNewTask')
        .send({ bucketId: 101 })
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });
  describe('deleteTask', function() {
    it('should delete the task of give id', done => {
      sinon.stub(TODO_LOGS, 'deleteTask');
      request(handleRequest)
        .post('/deleteTask')
        .send({ bucketId: 1000, taskId: '2000' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId is not given', function(done) {
      request(handleRequest)
        .post('/deleteTask')
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
    it(' should give bad request when task is not given', function(done) {
      request(handleRequest)
        .post('/deleteTask')
        .send({ bucketId: 101 })
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });

  describe('editTask', function() {
    it('should edit the task of give id', done => {
      sinon.stub(TODO_LOGS, 'editTask');
      request(handleRequest)
        .post('/editTask')
        .send({ bucketId: 1000, taskId: '2000', text: 'take books' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId or text is not given', function(done) {
      request(handleRequest)
        .post('/editTask')
        .send({ taskId: 123 })
        .set('accept', 'application/json')
        .expect(400, done);
    });
    it(' should give bad request when taskId or text is not given', function(done) {
      request(handleRequest)
        .post('/editTask')
        .send({ bucketId: 101 })
        .set('accept', 'application/json')
        .expect(400, done);
    });
    it(' should give bad request when taskId or bucketId is not given', function(done) {
      request(handleRequest)
        .post('/editTask')
        .send({ text: '' })
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });

  describe('setStatus', function() {
    it('should mark the task as done of give id', done => {
      sinon.stub(TODO_LOGS, 'changeTaskStatus');
      request(handleRequest)
        .post('/setStatus')
        .send({ bucketId: 1000, taskId: '2000' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId is not given', function(done) {
      request(handleRequest)
        .post('/setStatus')
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
    it(' should give bad request when task is not given', function(done) {
      request(handleRequest)
        .post('/setStatus')
        .send({ bucketId: 101 })
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });
  describe('/search', function() {
    it('should search title if the search-by option is Title', function(done) {
      sinon.stub(TODO_LOGS, 'searchTitle').returns({});
      request(handleRequest)
        .post('/search')
        .send({ text: 'a', searchBy: 'Title' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it('should search task if the search-by option is Task', function(done) {
      sinon.stub(TODO_LOGS, 'searchTask').returns({});
      request(handleRequest)
        .post('/search')
        .send({ text: 'a', searchBy: 'Task' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it('should search task if the search-by option is Task', function(done) {
      sinon.stub(TODO_LOGS, 'getAllLogs').returns({});
      request(handleRequest)
        .post('/search')
        .send({ text: '' })
        .set('accept', 'application/json')
        .expect(200)
        .end(() => {
          sinon.assert.calledOnce(TODO_LOGS.getAllLogs);
          done();
        });
    });
  });
});
