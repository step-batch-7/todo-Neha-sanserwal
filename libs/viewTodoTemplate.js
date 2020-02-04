const replaceText = function(key, value, template) {
  const pattern = new RegExp(`__${key}__`, 'g');
  template = template.replace(pattern, value);
  return template;
};
const readTask = function(task, loadFile) {
  let taskTemplate = loadFile('templates/taskTemplate.html', 'utf8');
  for (const [key, value] of Object.entries(task)) {
    taskTemplate = replaceText(key, value, taskTemplate);
  }
  return taskTemplate;
};
const collectTaskList = function(todoList, loadFile) {
  let listTemplate = '';
  for (task of todoList) {
    listTemplate += readTask(task, loadFile);
  }
  return listTemplate;
};

const readTodoList = function(todoList) {
  let todoTemplate = this.loadFile('templates/todoTemplate.html', 'utf8');
  for (const [key, value] of Object.entries(todoList)) {
    if (key !== 'todoItems') {
      todoTemplate = replaceText(key, value, todoTemplate);
    } else {
      const allTasks = collectTaskList(value, this.loadFile);
      todoTemplate = replaceText(key, allTasks, todoTemplate);
    }
  }
  return todoTemplate;
};

const loadTodoPage = function(allTodo, loadFile) {
  const todoPage = loadFile('templates/todoPage.html', 'utf8');
  const todoTemplate = allTodo.map(readTodoList.bind({ loadFile }));
  return todoPage.replace('__todo__', todoTemplate.join('\n'));
};

module.exports = { loadTodoPage };
