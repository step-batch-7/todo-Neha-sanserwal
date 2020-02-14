const express = require('express');
const todoHandlers = require('./handlers');
const router = express.Router();

router.use(todoHandlers.checkUserAccessability);
router.use(todoHandlers.loadUserData);
router.get('/todo', todoHandlers.serveTodoPage);
router.post(
  '/saveTodo',
  todoHandlers.hasOptions('title'),
  todoHandlers.saveBucket
);
router.post(
  '/deleteBucket',
  todoHandlers.hasOptions('bucketId'),
  todoHandlers.deleteBucket
);
router.post(
  '/editTitle',
  todoHandlers.hasOptions('bucketId'),
  todoHandlers.editBucketTitle
);

module.exports = { router };
