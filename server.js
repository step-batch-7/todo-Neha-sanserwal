const app = require('./libs/app');
const { loadData, writeToFile } = require('./libs/fileOperators');
const config = require('./config');

const main = function(port) {
  app.locals.writer = writeToFile;
  app.locals.data = loadData(config['data_store']);
  app.locals.path = config['data_store'];
  app.locals.sessions = {};

  // eslint-disable-next-line no-console
  app.listen(port, () => console.log(`listening to ${port}`));
};
const port = process.env.PORT || 8000;
main(port);
