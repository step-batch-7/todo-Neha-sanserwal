const sendStatusRequest = function(event) {
  req = new XMLHttpRequest();
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
    console.log(this.responseText);
    changeMainPageContent(this.status, this.responseText, 'todoPage');
  };
  req.open('POST', '/saveTodo');
  const title = document.getElementById('title').value;
  const task = document.getElementById('task').value;
  req.send(JSON.stringify({ title, task }));
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
