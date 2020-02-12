const loadSignUpPage = function() {
  const todoPage = document.querySelector('.todoPage');
  todoPage.innerHTML = ` <div class="loginPage">
        <h1> Sign Up </h1>
        <div class="loginContainer">
          <input type="text" placeholder="username" />
          <input type="password" placeholder="password" />
          <input type="password" placeholder="re-enter password" />
          <button>SIGN UP</button>
          <div>Already have an account <a href="#" onclick="loadLoginPage()">Sign In</a> here</div>
        </div>
      </div>`;
};

const loadLoginPage = function() {
  const todoPage = document.querySelector('.todoPage');
  todoPage.innerHTML = `<div class="loginPage">
        <h1>Log In</h1>
        <div class="loginContainer">
          <input type="text" placeholder="username" />
          <input type="password" placeholder="password" />
          <button onclick="serveTodo(event)">SIGN IN</button>
          <div>
            Don't have account
            <a href="#" onclick="loadSignUpPage()">Sign Up</a> here
          </div>
        </div>
      </div>`;
};

const changeMainPageContent = function(status, responseText, contentClass) {
  const Ok = 200;
  if (status === Ok) {
    document.getElementsByClassName(contentClass)[0].innerHTML = responseText;
  }
};
const changeSearchBy = function() {
  const searchBy = document.querySelector('.searchBy');
  const option = searchBy.dataset.searchby;
  if (option === 'Title') {
    searchBy.setAttribute('data-searchby', 'Task');
    return;
  }
  searchBy.setAttribute('data-searchby', 'Title');
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
