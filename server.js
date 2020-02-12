const http = require('http');
const { handleRequest } = require('./libs/routes');
const config = require('./config.js');

const defaultPort = 8000;

const main = function(port = defaultPort) {
  const server = new http.Server(handleRequest.bind(config));

  server.listen(port);
};
const [, , port] = process.argv;
main(port);
