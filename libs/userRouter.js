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
router.post(
  '/saveNewTask',
  todoHandlers.hasOptions('bucketId', 'task'),
  todoHandlers.saveNewTask
);
router.post(
  '/setStatus',
  todoHandlers.hasOptions('bucketId', 'taskId'),
  todoHandlers.handleTaskStatus
);
router.post(
  '/editTask',
  todoHandlers.hasOptions('bucketId', 'taskId', 'text'),
  todoHandlers.editTask
);
router.post(
  '/deleteTask',
  todoHandlers.hasOptions('bucketId', 'taskId'),
  todoHandlers.deleteTask
);
router.post(
  '/search',
  todoHandlers.hasOptions('text', 'searchBy'),
  todoHandlers.search
);
module.exports = { router };
