const request = require('supertest');
const { handleRequest } = require('../libs/routes');
const fs = require('fs');
const sinon = require('sinon');

describe('GET request', function() {
  before(() => {
    sinon.replace(fs, 'existsSync', () => {
      return true;
    });
    sinon.replace(fs, 'readFileSync', () => {
      return '[]';
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
  before(() => {
    sinon.replace(fs, 'existsSync', () => {
      return true;
    });
    sinon.replace(fs, 'readFileSync', () => {
      return '{}';
    });
    sinon.replace(fs, 'writeFileSync', () => {});
  });
  it('should post the todo', function(done) {
    request(handleRequest)
      .post('/saveTodo')
      .send({ username: 'john', comment: 'hello' })
      .expect(200, done);
  });
  after(() => {
    sinon.restore();
  });
});
