const sendStatusRequest = function(event) {
  req = new XMLHttpRequest();
  req.open('POST', '/setStatus');
  if (req.status == 200) {
    document.getElementsByClassName(
      'todo-list'
    )[0].innerHTML = this.responseText;
  }
  const bucketId = event.target.className;
  const taskId = event.target.id;
  req.send(JSON.stringify({ bucketId, taskId }));
};

const sendSaveRequest = function() {
  const req = new XMLHttpRequest();
  req.onload = function() {
    document.getElementsByClassName(
      'todoPage'
    )[0].innerHTML = this.responseText;
  };
  req.open('POST', '/saveTodo');
  const title = document.getElementById('title').value;
  const task = document.getElementById('task').value;
  req.send(JSON.stringify({ title, task }));
};
