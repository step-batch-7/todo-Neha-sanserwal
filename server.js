const app = require('./libs/app');

const defaultPort = 8000;

const main = function(port = defaultPort) {
  app.listen(port, () => console.log(`listening to ${port}`));
};
const [, , port] = process.argv;
main(port);
