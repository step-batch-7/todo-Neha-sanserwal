const changeMainPageContent = function(status, responseText, contentClass) {
  if (status === 200) {
    document.getElementsByClassName(contentClass)[0].innerHTML = responseText;
  }
};

const showNewTaskForm = function(event) {
  const bucketId = event.target.id;
  const taskInput = document.querySelector(`#newTask${bucketId}`);
  if (taskInput.style.display === 'flex') {
    taskInput.style.display = 'none';
    return;
  }
  taskInput.style.display = 'flex';
};
