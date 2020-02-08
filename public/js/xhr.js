const sendStatusRequest = function(event) {
  const req = new XMLHttpRequest();
  req.open('POST', '/setStatus');
  req.onload = function() {
    changeMainPageContent(this.status, this.responseText, 'todoPage');
  };
  const bucketId = event.target.className;
  const taskId = event.target.id;
  req.send(JSON.stringify({ bucketId, taskId }));
};

const sendSaveRequest = function() {
  const req = new XMLHttpRequest();
  req.onload = function() {
    changeMainPageContent(this.status, this.responseText, 'todoPage');
  };
  req.open('POST', '/saveTodo');
  const title = document.getElementById('title').value;
  req.send(JSON.stringify({ title }));
};
const sendEditTitleRequest = function(event) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    changeMainPageContent(this.status, this.responseText, 'todoPage');
  };
  req.open('POST', '/editTitle');
  const title = event.target.innerText;
  const bucketId = event.target.id;
  req.send(JSON.stringify({ title, bucketId }));
};

const sendDeleteBucketRequest = function(event) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    changeMainPageContent(this.status, this.responseText, 'todoPage');
  };
  req.open('POST', '/deleteBucket');
  const bucketId = event.target.id;
  req.send(JSON.stringify({ bucketId }));
};

const sendSaveNewTaskRequest = function(event) {
  const req = new XMLHttpRequest();
  const bucketId = event.target.id;
  const inputBox = `#newTask${bucketId}[name="newTask"]`;
  const task = document.querySelector(inputBox).value;
  req.onload = function() {
    changeMainPageContent(this.status, this.responseText, 'todoPage');
  };
  req.open('POST', '/saveNewTask');
  req.send(JSON.stringify({ bucketId, task }));
};

const sendDeleteTaskRequest = function(event) {
  const classes = event.target.className;
  const req = new XMLHttpRequest();
  const [bucketId] = classes.split(' ');
  req.onload = function() {
    changeMainPageContent(this.status, this.responseText, 'todoPage');
  };
  req.open('POST', '/deleteTask');
  const taskId = event.target.id;
  req.send(JSON.stringify({ bucketId, taskId }));
};

const sendEditTaskRequest = function(event) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    changeMainPageContent(this.status, this.responseText, 'todoPage');
  };
  req.open('POST', '/editTask');
  const taskId = event.target.id;
  const text = event.target.innerText;
  const classes = event.target.className;
  const [bucketId] = classes.split(' ');
  req.send(JSON.stringify({ taskId, bucketId, text }));
};

const sendSearchRequest = function(event) {
  const req = new XMLHttpRequest();
  const text = event.target.value;
  const searchBy = document.querySelector('.searchBy').dataset.searchby;
  req.onload = function() {
    changeMainPageContent(this.status, this.responseText, 'todoPage');
  };
  req.open('POST', '/search');
  req.send(JSON.stringify({ text, searchBy }));
};
