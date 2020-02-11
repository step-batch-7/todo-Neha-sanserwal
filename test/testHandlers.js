const request = require('supertest');
const { handleRequest } = require('../libs/routes');
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
  it('should serveTodo when the route is /index.html', function(done) {
    request(handleRequest)
      .get('/index.html')
      .expect('Content-type', 'text/html')
      .expect(200, done);
  });
  it('should load css when browser ask for it', function(done) {
    request(handleRequest)
      .get('/css/app.css')
      .expect('Content-type', 'text/css')
      .expect(200, done);
  });
  it('should load js files when browser ask for it', function(done) {
    request(handleRequest)
      .get('/js/changeContents.js')
      .expect('Content-type', 'text/js')
      .expect(200, done);
  });
  after(() => {
    sinon.restore();
  });
});

describe('Bad request', function() {
  it('should not allow methods on page which are not allowed', function(done) {
    request(handleRequest)
      .put('/')
      .send({ name: 'john' })
      .expect(400, done);
  });
});

describe('file not found', function() {
  it('should give error if path is not found', function(done) {
    request(handleRequest)
      .get('/abc')
      .expect(404, done);
  });
});

describe('POST request', function() {
  it('should post the todo', function(done) {
    sinon.stub(TODO_LOGS, 'append');
    request(handleRequest)
      .post('/saveTodo')
      .send('{ "title": "class" }')
      .expect(200, done);
  });
  it(' should delete a todo', function(done) {
    sinon.stub(TODO_LOGS, 'deleteBucket');
    request(handleRequest)
      .post('/deleteBucket')
      .send('{"bucketId":1000}')
      .expect(200, done);
  });
  it('should edit the title of given todoId', done => {
    sinon.stub(TODO_LOGS, 'editBucketTitle');
    request(handleRequest)
      .post('/editTitle')
      .send('{ "bucketId": 1000, "title": "office" }')
      .expect(200, done);
  });
  it('should save the given task', done => {
    sinon.stub(TODO_LOGS, 'appendTask');
    request(handleRequest)
      .post('/saveNewTask')
      .send('{ "bucketId": 1000, "task":"hello"}')
      .expect(200, done);
  });
  it('should delete the task of give id', done => {
    sinon.stub(TODO_LOGS, 'deleteTask');
    request(handleRequest)
      .post('/deleteTask')
      .send('{ "bucketId": 1000, "taskId":"2000"}')
      .expect(200, done);
  });
  it('should edit the task of give id', done => {
    sinon.stub(TODO_LOGS, 'editTask');
    request(handleRequest)
      .post('/editTask')
      .send('{ "bucketId": 1000, "taskId":"2000","text":"take books"}')
      .expect(200, done);
  });
  it('should mark the task as done of give id', done => {
    sinon.stub(TODO_LOGS, 'changeTaskStatus');
    request(handleRequest)
      .post('/setStatus')
      .send('{ "bucketId": 1000, "taskId":"2000"}')
      .expect(200, done);
  });
  describe('/search', function() {
    it('should search title if the search-by option is Title', function(done) {
      sinon.stub(TODO_LOGS, 'searchTitle').returns({});
      request(handleRequest)
        .post('/search')
        .send('{ "text": "a", "searchBy":"Title"}')
        .expect(200, done);
    });
    it('should search task if the search-by option is Task', function(done) {
      sinon.stub(TODO_LOGS, 'searchTask').returns({});
      request(handleRequest)
        .post('/search')
        .send('{ "text": "a", "searchBy":"Task"}')
        .expect(200, done);
    });
    it('should search task if the search-by option is Task', function(done) {
      sinon.stub(TODO_LOGS, 'getAllLogs').returns({});
      request(handleRequest)
        .post('/search')
        .send('{ "text": ""}')
        .expect(200)
        .end(() => {
          sinon.assert.calledOnce(TODO_LOGS.getAllLogs);
          done();
        });
    });
  });
});
