const request = require('supertest');
const app = require('../libs/app');
const fs = require('fs');
const sinon = require('sinon');
const { TodoLogs } = require('../libs/todoLogs');
const { Bucket } = require('../libs/todo');
const { Session } = require('../libs/session');
const { Task } = require('../libs/task');

describe('GET request', function() {
  let cookie;
  before(() => {
    sinon.replace(fs, 'existsSync', () => {
      return true;
    });
    sinon.replace(fs, 'readFileSync', () => {
      return '{}';
    });
    sinon.stub(Math, 'random').returns(4);
    sinon.useFakeTimers(new Date().getTime());
  });

  beforeEach(() => {
    app.locals.data = {
      john: { username: 'john', password: 123, todo: new TodoLogs({}, 1000) }
    };
    app.locals.sessions = {
      john: new Session(1581756499018, 'john')
    };
    cookie =
      'todo=j%3A%7B%22id%22%3A1581756499018%2C%22user%22%3A%22john%22%7D';
  });

  describe('homePage', function() {
    it('should serveTodo when the route is /', function(done) {
      request(app)
        .get('/')
        .expect('Content-type', /text\/html/)
        .expect(200, done);
    });
    it('should serveTodo when the route is /todo and cookie is set', done => {
      request(app)
        .get('/user/todo')
        .set('cookie', cookie)
        .expect('content-type', /text\/html/)
        .expect(200, done);
    });
  });
  it('should load css when browser ask for it', function(done) {
    request(app)
      .get('/css/app.css')
      .expect('Content-type', /text\/css/)
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
      .expect(405, done);
  });
});

describe('Bad request', function() {
  it('should not allow methods on page which are not allowed', function(done) {
    request(app)
      .delete('/')
      .send({ name: 'john' })
      .expect(405, done);
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
  let cookie;
  before(() => {
    sinon.stub(Math, 'random').returns(4);
    sinon.useFakeTimers(new Date().getTime());
  });

  after(() => {
    sinon.restore();
  });

  describe('saveTodo', function() {
    beforeEach(() => {
      app.locals.data = {
        john: { username: 'john', password: 123, todo: new TodoLogs({}, 1000) }
      };
      app.locals.path = 'abc';
      app.locals.writer = () => {};
      cookie =
        'todo=j%3A%7B%22id%22%3A1581756499018%2C%22user%22%3A%22john%22%7D';
    });

    it('should save the todo ', function(done) {
      request(app)
        .post('/user/saveTodo')
        .set('cookie', cookie)
        .send({ title: 'class' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it('should give bad request when title is not given', function(done) {
      request(app)
        .post('/user/saveTodo')
        .set('cookie', cookie)
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });

  describe('deleteBucket', function() {
    beforeEach(() => {
      const bucket = new Bucket('abc', 1001, {}, 2000);
      app.locals.data = {
        john: {
          username: 'john',
          password: 123,
          todo: new TodoLogs({ 1001: bucket }, 1001)
        }
      };
      app.locals.path = 'abc';
      app.locals.writer = () => {};
    });
    it(' should delete a todo', function(done) {
      request(app)
        .post('/user/deleteBucket')
        .set('cookie', cookie)
        .send({ bucketId: 1001 })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId is not given', function(done) {
      request(app)
        .post('/user/deleteBucket')
        .set('cookie', cookie)
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });
  describe('editTitle', function() {
    beforeEach(() => {
      const bucket = new Bucket('abc', 1001, {}, 2000);
      app.locals.data = {
        john: {
          username: 'john',
          password: 123,
          todo: new TodoLogs({ 1001: bucket }, 1001)
        }
      };
      app.locals.path = 'abc';
      app.locals.writer = () => {};
    });
    it('should edit the title of given todoId', done => {
      request(app)
        .post('/user/editTitle')
        .set('cookie', cookie)
        .send({ bucketId: 1001, title: 'office' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId is not given', function(done) {
      request(app)
        .post('/user/editTitle')
        .set('cookie', cookie)
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });
  describe('saveNewTask', function() {
    beforeEach(() => {
      const bucket = new Bucket('abc', 1001, {}, 2000);
      app.locals.data = {
        john: {
          username: 'john',
          password: 123,
          todo: new TodoLogs({ 1001: bucket }, 1001)
        }
      };
      app.locals.path = 'abc';
      app.locals.writer = () => {};
    });
    it('should save the given task', done => {
      request(app)
        .post('/user/saveNewTask')
        .set('cookie', cookie)
        .send({ bucketId: 1001, task: 'hello' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId is not given', function(done) {
      request(app)
        .post('/user/saveNewTask')
        .set('cookie', cookie)
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
    it(' should give bad request when task is not given', function(done) {
      request(app)
        .post('/user/saveNewTask')
        .set('cookie', cookie)
        .send({ bucketId: 101 })
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });
  describe('deleteTask', function() {
    beforeEach(() => {
      const task = new Task('', 1001, 2001, 'hello');
      const bucket = new Bucket('abc', 1001, { 2001: task }, 2001);
      app.locals.data = {
        john: {
          username: 'john',
          password: 123,
          todo: new TodoLogs({ 1001: bucket }, 1001)
        }
      };
      app.locals.path = 'abc';
      app.locals.writer = () => {};
    });
    it('should delete the task of give id', done => {
      request(app)
        .post('/user/deleteTask')
        .set('cookie', cookie)
        .send({ bucketId: 1001, taskId: 2001 })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId is not given', function(done) {
      request(app)
        .post('/user/deleteTask')
        .set('cookie', cookie)
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
    it(' should give bad request when task is not given', function(done) {
      request(app)
        .post('/user/deleteTask')
        .set('cookie', cookie)
        .send({ bucketId: 101 })
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });

  describe('editTask', function() {
    beforeEach(() => {
      const task = new Task('', 1001, 2001, 'hello');
      const bucket = new Bucket('abc', 1001, { 2001: task }, 2001);
      app.locals.data = {
        john: {
          username: 'john',
          password: 123,
          todo: new TodoLogs({ 1001: bucket }, 1001)
        }
      };
      app.locals.path = 'abc';
      app.locals.writer = () => {};
    });
    it('should edit the task of give id', done => {
      request(app)
        .post('/user/editTask')
        .set('cookie', cookie)
        .send({ bucketId: 1001, taskId: 2001, text: 'take books' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId or text is not given', function(done) {
      request(app)
        .post('/user/editTask')
        .set('cookie', cookie)
        .send({ taskId: 123 })
        .set('accept', 'application/json')
        .expect(400, done);
    });
    it(' should give bad request when taskId or text is not given', function(done) {
      request(app)
        .post('/user/editTask')
        .set('cookie', cookie)
        .send({ bucketId: 101 })
        .set('accept', 'application/json')
        .expect(400, done);
    });
    it(' should give bad request when taskId or bucketId is not given', function(done) {
      request(app)
        .post('/user/editTask')
        .set('cookie', cookie)
        .send({ text: '' })
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });

  describe('setStatus', function() {
    beforeEach(() => {
      const task = new Task('', 1001, 2001, 'hello');
      const bucket = new Bucket('abc', 1001, { 2001: task }, 2001);
      app.locals.data = {
        john: {
          username: 'john',
          password: 123,
          todo: new TodoLogs({ 1001: bucket }, 1001)
        }
      };
      app.locals.path = 'abc';
      app.locals.writer = () => {};
    });
    it('should mark the task as done of give id', done => {
      request(app)
        .post('/user/setStatus')
        .set('cookie', cookie)
        .send({ bucketId: 1001, taskId: 2001 })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it(' should give bad request when bucketId is not given', function(done) {
      request(app)
        .post('/user/setStatus')
        .set('cookie', cookie)
        .send({})
        .set('accept', 'application/json')
        .expect(400, done);
    });
    it(' should give bad request when task is not given', function(done) {
      request(app)
        .post('/user/setStatus')
        .set('cookie', cookie)
        .send({ bucketId: 101 })
        .set('accept', 'application/json')
        .expect(400, done);
    });
  });
  describe('/search', function() {
    beforeEach(() => {
      const task = new Task('', 1001, 2001, 'hello');
      const bucket = new Bucket('abc', 1001, { 2001: task }, 2001);
      app.locals.data = {
        john: {
          username: 'john',
          password: 123,
          todo: new TodoLogs({ 1001: bucket }, 1001)
        }
      };
      app.locals.path = 'abc';
      app.locals.writer = () => {};
    });
    it('should search title if the search-by option is Title', function(done) {
      request(app)
        .post('/user/search')
        .set('cookie', cookie)
        .send({ text: 'a', searchBy: 'Title' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it('should search task if the search-by option is Task', function(done) {
      request(app)
        .post('/user/search')
        .set('cookie', cookie)
        .send({ text: 'h', searchBy: 'Task' })
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it('should return to same page when text is empty and searchBy is Task', function(done) {
      request(app)
        .post('/user/search')
        .send({ text: '', searchBy: 'Task' })
        .set('cookie', cookie)
        .set('accept', 'application/json')
        .expect(200, done);
    });
    it('should return to same page when text is empty and searchBy is Title', function(done) {
      request(app)
        .post('/user/search')
        .send({ text: '', searchBy: 'Title' })
        .set('cookie', cookie)
        .set('accept', 'application/json')
        .expect(200, done);
    });
  });
});
