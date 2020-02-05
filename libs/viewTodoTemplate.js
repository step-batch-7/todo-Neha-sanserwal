const replaceText = function(key, value, template) {
  const pattern = new RegExp(`__${key}__`, 'g');
  const newTemplate = template.replace(pattern, value);
  return newTemplate;
};
const readTask = function(task, loadFile) {
  let taskTemplate = loadFile('templates/taskTemplate.html', 'utf8');
  for (const [key, value] of Object.entries(task)) {
    taskTemplate = replaceText(key, value, taskTemplate);
  }
  return taskTemplate;
};

const collectTaskList = function(tasks, loadFile) {
  let listTemplate = '';
  for (const [, value] of Object.entries(tasks)) {
    listTemplate += readTask(value, loadFile);
  }
  return listTemplate;
};

const readTodoList = function(bucket, loadFile) {
  let todoTemplate = loadFile('templates/todoTemplate.html', 'utf8');
  for (const [key, value] of Object.entries(bucket)) {
    if (key !== 'tasks') {
      todoTemplate = replaceText(key, value, todoTemplate);
    } else {
      const allTasks = collectTaskList(value, loadFile);
      todoTemplate = replaceText(key, allTasks, todoTemplate);
    }
  }
  return todoTemplate;
};

const loadTodoPage = function(allTodo, loadFile) {
  const todoPage = loadFile('templates/todoPage.html', 'utf8');
  let todoCards = '';
  for (const [, value] of Object.entries(allTodo)) {
    todoCards += readTodoList(value, loadFile);
  }
  return todoPage.replace('__todo__', todoCards);
};

module.exports = { loadTodoPage };
