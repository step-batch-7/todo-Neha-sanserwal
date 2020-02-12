const loadSignUpPage = function() {
  const todoPage = document.querySelector('.todoPage');
  todoPage.innerHTML = ` <div class="loginPage">
        <h1> Sign Up </h1>
        <div class="loginContainer">
          <input type="text" placeholder="username" name="username"/>
          <input type="password" placeholder="password" name="password"/>
          <input type="password" placeholder="re-enter password" />
          <button onclick="sendAuthDetails('/signup')">SIGN UP</button>
          <div>Already have an account <a href="#" onclick="loadLoginPage()">Sign In</a> here</div>
        </div>
      </div>`;
};

const loadLoginPage = function() {
  const todoPage = document.querySelector('.todoPage');
  todoPage.innerHTML = `<div class="loginPage">
        <h1>Log In</h1>
        <div class="loginContainer">
          <input type="text" placeholder="username" name="username"/>
          <input type="password" placeholder="password" name="password" />
          <button onclick="sendAuthDetails('/login')">SIGN IN</button>
          <div>
            Don't have account
            <a href="#" onclick="loadSignUpPage()">Sign Up</a> here
          </div>
        </div>
      </div>`;
};

const loadTodoNav = function() {
  const nav = document.querySelector('.headers');
  nav.innerHTML = `<div class="heading">
        <h1>POST IT</h1>
      </div>
      <div class="searchBar">
        <input
          required
          type="text"
          value=""
          onkeyup="sendSearchRequest(event)"
          placeholder="&#xF002; Search"
        />
        <div class="toggle">
          <input type="checkbox" id="check" />
          <label for="check" onclick="changeSearchBy()">
            <div class="searchBy" data-searchby="Title"></div>
          </label>
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

const calledAfterAuth = function() {
  loadLoginPage();
};
