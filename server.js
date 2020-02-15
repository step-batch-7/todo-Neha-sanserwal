const app = require('./libs/app');
const { loadData, writeToFile } = require('./libs/fileOperators');
const config = require('./config');

const defaultPort = 8000;

const main = function(port = defaultPort) {
  app.locals.writer = writeToFile;
  app.locals.data = loadData(config['data_store']);
  app.locals.path = config['data_store'];
  app.locals.sessions = {};

  // eslint-disable-next-line no-console
  app.listen(port, () => console.log(`listening to ${port}`));
};
const [, , port] = process.argv;
main(port);
