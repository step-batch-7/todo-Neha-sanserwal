const fs = require('fs');
const { App } = require('./app.js');

const STATIC_DIR = `${__dirname}/../public`;

const getFileExtension = function(fileName) {
  const fileExt = fileName.split('.').pop();
  return fileExt;
};
const loadFile = function(filePath, encoding) {
  if (encoding) {
    return fs.readFileSync(filePath, encoding);
  }
  return fs.readFileSync(filePath);
};

const isFileNotAvailable = function(filePath) {
  const stats = fs.existsSync(filePath) && fs.statSync(filePath);
  return !stats || !stats.isFile();
};

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

const notFound = function(req, res) {
  res.writeHead('404', 'NOT FOUND');
  res.end();
};
const methodNotAllowed = function(req, res) {
  res.writeHead('400', 'Method Not Allowed');
  res.end();
};

const app = new App();

app.use(readBody);
app.get('/', loadStaticResponse);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
