const replaceText = function(key, value, template) {
  const pattern = new RegExp(`__${key}__`, 'g');
  const newTemplate = template.replace(pattern, value);
  return newTemplate;
};
const readTask = function(task, reader) {
  let taskTemplate = reader('templates/taskTemplate.html', 'utf8');
  for (const [key, value] of Object.entries(task)) {
    taskTemplate = replaceText(key, value, taskTemplate);
  }
  return taskTemplate;
};

const collectTaskList = function(tasks, reader) {
  let listTemplate = '';
  for (const [, value] of Object.entries(tasks)) {
    listTemplate += readTask(value, reader);
  }
  return listTemplate;
};

const readTodoList = function(bucket, reader) {
  let todoTemplate = reader('templates/todoTemplate.html', 'utf8');
  for (const [key, value] of Object.entries(bucket)) {
    if (key !== 'tasks') {
      todoTemplate = replaceText(key, value, todoTemplate);
    } else {
      const allTasks = collectTaskList(value, reader);
      todoTemplate = replaceText(key, allTasks, todoTemplate);
    }
  }
  return todoTemplate;
};
const readCards = function(allTodo, reader) {
  let todoCards = '';
  for (const [, value] of Object.entries(allTodo)) {
    todoCards += readTodoList(value, reader);
  }
  return todoCards;
};
const loadTodoPage = function(allTodo, loadFile) {
  const todoPage = loadFile('templates/todoPage.html', 'utf8');
  const todoCards = readCards(allTodo, loadFile);
  return todoPage.replace('__todo__', todoCards);
};

module.exports = { loadTodoPage, readCards };
