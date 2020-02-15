const handleXhrRequest = function(url, data, callback) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    callback(this.status, this.responseText, 'todoPage');
  };
  req.open('POST', url);
  req.setRequestHeader('content-type', 'application/json');
  req.setRequestHeader('set-cookie', document.cookie);
  req.send(JSON.stringify(data));
};

const serveTodo = function() {
  const req = new XMLHttpRequest();
  req.onload = function() {
    loadTodoNav();
    changeMainPageContent(this.status, this.responseText, 'todoPage');
  };
  req.open('GET', '/user/todo');
  req.send();
};
const sendSaveRequest = function() {
  const title = document.getElementById('title').value;
  handleXhrRequest('/user/saveTodo', { title }, changeMainPageContent);
};

const sendEditTitleRequest = function(event) {
  const title = event.target.innerText;
  const bucketId = event.target.id;
  const data = { title, bucketId };
  handleXhrRequest('/user/editTitle', data, changeMainPageContent);
};

const sendDeleteBucketRequest = function(event) {
  const bucketId = event.target.id;
  const data = { bucketId };
  handleXhrRequest('/user/deleteBucket', data, changeMainPageContent);
};

const sendSaveNewTaskRequest = function(event) {
  const bucketId = event.target.id;
  const inputBox = `#newTask${bucketId}[name="newTask"]`;
  const task = document.querySelector(inputBox).value;
  const data = { task, bucketId };
  handleXhrRequest('/user/saveNewTask', data, changeMainPageContent);
};
const sendStatusRequest = function(event) {
  const bucketId = event.target.className;
  const taskId = event.target.id;
  const data = { bucketId, taskId };
  handleXhrRequest('/user/setStatus', data, changeMainPageContent);
};

const sendDeleteTaskRequest = function(event) {
  const classes = event.target.className;
  const [bucketId] = classes.split(' ');
  const taskId = event.target.id;
  const data = { bucketId, taskId };
  handleXhrRequest('/user/deleteTask', data, changeMainPageContent);
};

const sendEditTaskRequest = function(event) {
  const taskId = event.target.id;
  const text = event.target.innerText;
  const classes = event.target.className;
  const [bucketId] = classes.split(' ');
  const data = { taskId, bucketId, text };
  handleXhrRequest('/user/editTask', data, changeMainPageContent);
};

const sendSearchRequest = function(event) {
  const text = event.target.value;
  const searchBy = document.querySelector('.searchBy').dataset.searchby;
  const data = { text, searchBy };
  handleXhrRequest('/user/search', data, changeMainPageContent);
};

const sendAuthDetails = function(type) {
  const username = document.querySelector('input[name="username"]').value;
  const password = document.querySelector('input[name="password"]').value;
  handleXhrRequest(type, { username, password }, calledAfterAuth);
};

const sendLogoutRequest = function() {
  handleXhrRequest('/logout', {}, () => {
    loadLoginPage();
    document.querySelector('.searchbar').remove();
  });
};
