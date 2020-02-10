const http = require('http');
const { handleRequest } = require('./libs/routes');

const defaultPort = 8000;

const main = function(port = defaultPort) {
  const server = new http.Server(handleRequest);

  server.listen(port);
};
const [, , port] = process.argv;
main(port);
