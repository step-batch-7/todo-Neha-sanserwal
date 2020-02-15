const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { router } = require('./userRouter.js');
const handlers = require('./handlers');

const app = express();

app.use(morgan('tiny'));
app.use(express.json({ extends: 'true' }));
app.use(cookieParser());
app.use(express.static('public'));
app.use((req, res, next) => {
  req.data = req.app.locals.data;
  req.path = req.app.locals.path;
  req.writer = req.app.locals.writer;
  req.sessions = req.app.locals.sessions;
  next();
});
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
app.post('/logout', handlers.logOutUser);
app.use('/user', router);

app.put('/*/', (req, res) => {
  res.status('405').send('Method Not Allowed');
});
app.delete('/*/', (req, res) => {
  res.status('405').send('Method Not Allowed');
});
module.exports = app;
