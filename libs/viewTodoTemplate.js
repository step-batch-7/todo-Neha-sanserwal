const replaceText = function(key, value, template) {
  const pattern = new RegExp(`__${key}__`, 'g');
  const newTemplate = template.replace(pattern, value);
  return newTemplate;
};
const readTask = function(task, reader) {
  let taskTemplate = reader('templates/taskTemplate.html', 'utf8');
  for (const key in task) {
    taskTemplate = replaceText(key, task[key], taskTemplate);
  }
  return taskTemplate;
};

const collectTaskList = function(tasks, reader) {
  let listTemplate = '';
  for (const key in tasks) {
    listTemplate += readTask(tasks[key], reader);
  }
  return listTemplate;
};

const readTodoList = function(bucket, reader) {
  let todoTemplate = reader('templates/todoTemplate.html', 'utf8');
  for (const key in bucket) {
    if (key !== 'tasks') {
      todoTemplate = replaceText(key, bucket[key], todoTemplate);
    } else {
      const allTasks = collectTaskList(bucket[key], reader);
      todoTemplate = replaceText(key, allTasks, todoTemplate);
    }
  }
  return todoTemplate;
};
const readCards = function(allTodo, reader) {
  let todoCards = '';
  const keys = Object.keys(allTodo).reverse();
  keys.forEach(key => {
    todoCards += readTodoList(allTodo[key], reader);
  });
  return todoCards;
};
const loadTodoPage = function(allTodo, loadFile) {
  const todoPage = loadFile('templates/todoPage.html', 'utf8');
  const todoCards = readCards(allTodo, loadFile);
  return todoPage.replace('__todo__', todoCards);
};

module.exports = { loadTodoPage, readCards };
