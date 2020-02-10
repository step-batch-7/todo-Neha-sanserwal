const handleXhrRequest = function(url, method, data, callback) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    callback(this.status, this.responseText, 'todoPage');
  };
  req.open(method, url);
  req.send(JSON.stringify(data));
};
const serveTodo = function() {
  handleXhrRequest('/index.html', 'GET', {}, changeMainPageContent);
};
const sendSaveRequest = function() {
  const title = document.getElementById('title').value;
  handleXhrRequest('/saveTodo', 'POST', { title }, changeMainPageContent);
};

const sendEditTitleRequest = function(event) {
  const title = event.target.innerText;
  const bucketId = event.target.id;
  const data = { title, bucketId };
  handleXhrRequest('/editTitle', 'POST', data, changeMainPageContent);
};

const sendDeleteBucketRequest = function(event) {
  const bucketId = event.target.id;
  const data = { bucketId };
  handleXhrRequest('/deleteBucket', 'POST', data, changeMainPageContent);
};

const sendSaveNewTaskRequest = function(event) {
  const bucketId = event.target.id;
  const inputBox = `#newTask${bucketId}[name="newTask"]`;
  const task = document.querySelector(inputBox).value;
  const data = { task, bucketId };
  handleXhrRequest('/saveNewTask', 'POST', data, changeMainPageContent);
};
const sendStatusRequest = function(event) {
  const req = new XMLHttpRequest();
  const bucketId = event.target.className;
  const taskId = event.target.id;
  const data = { bucketId, taskId };
  handleXhrRequest('/setStatus', 'POST', data, changeMainPageContent);
};

const sendDeleteTaskRequest = function(event) {
  const classes = event.target.className;
  const [bucketId] = classes.split(' ');
  const taskId = event.target.id;
  const data = { bucketId, taskId };
  handleXhrRequest('/deleteTask', 'POST', data, changeMainPageContent);
};

const sendEditTaskRequest = function(event) {
  const taskId = event.target.id;
  const text = event.target.innerText;
  const classes = event.target.className;
  const [bucketId] = classes.split(' ');
  const data = { taskId, bucketId, text };
  handleXhrRequest('/editTask', 'POST', data, changeMainPageContent);
};

const sendSearchRequest = function(event) {
  const req = new XMLHttpRequest();
  const text = event.target.value;
  const searchBy = document.querySelector('.searchBy').dataset.searchby;
  const data = { text, searchBy };
  handleXhrRequest(`/search${searchBy}`, 'POST', data, changeMainPageContent);
};
