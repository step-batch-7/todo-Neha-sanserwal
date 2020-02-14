const express = require('express');
const cookieParser = require('cookie-parser');
const { router } = require('./userRouter.js');
const { loadData } = require('./fileOperators');
const config = require('../config');
const handlers = require('./handlers');

const app = express();

app.locals.data = loadData(config['data_store']);
app.locals.path = config['data_store'];

app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`url:${req.url}  method:${req.method}`);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.post(
  '/signup',
  handlers.checkAuthDetails,
  handlers.registerUser,
  handlers.loginUser
);
app.post(
  '/login',
  handlers.hasOptions('username', 'password'),
  handlers.loginUser
);
app.use('/user', router);
module.exports = app;
