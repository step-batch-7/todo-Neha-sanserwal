const readTask = function(task, loadFile) {
  let taskTemplate = loadFile('templates/taskTemplate.html', 'utf8');
  for (const [key, value] of Object.entries(task)) {
    console.log('---', key, value, '\n');
    taskTemplate = taskTemplate.replace(`__${key}__`, value);
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
      todoTemplate = todoTemplate.replace(`__${key}__`, value);
    } else {
      const allTasks = collectTaskList(value, this.loadFile);
      todoTemplate = todoTemplate.replace(`__${key}__`, allTasks);
    }
  }
  return todoTemplate;
};

const loadTodoTemplate = function(allTodo, todoPage, loadFile) {
  const todoTemplate = allTodo.map(readTodoList.bind({ loadFile }));
  return todoPage.replace('__todo__', todoTemplate.join('\n'));
};

module.exports = { loadTodoTemplate };
