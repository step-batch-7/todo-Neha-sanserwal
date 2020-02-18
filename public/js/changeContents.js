const loadSignUpPage = function() {
  const todoPage = document.querySelector('.todoPage');
  todoPage.innerHTML = ` <div class="loginPage">
        <h1> Sign Up </h1>
        <div class="loginContainer">
          <input type="text" onfocusout ='checkUserAvailability(this.value)' onfocus="clearErrorMsg('commonMsg','usernameMsg')" placeholder="Username" name="username"/>
          <div class = 'errorMsg' id = 'usernameMsg'></div>
          <input type="password" placeholder="Password" name="password" onfocus="clearErrorMsg('commonMsg','passwordMsg')" onkeyup= "showPassNotMatchError(this)"/>
          <div class = 'errorMsg' id = 'passwordMsg'></div>
          <input type="password" onkeyup= "showPassNotMatchError(this)" onfocus="clearErrorMsg('commonMsg','confirmPassMsg')" placeholder="Confirm password" name ='confirmPass'/>
          <div class = 'errorMsg' id = 'confirmPassMsg' ></div>
          <div class = 'errorMsg' id = 'commonMsg' ></div>
          <div class = 'button'>
            <button onclick="checkErrorInAuth('/signup')" id='signUpBtn' >SIGN UP</button>
          </div>
          <div class= 'authLink'>Already have an account? <a  onclick="loadLoginPage()">Sign In</a> here</div>
        </div>
      </div>`;
};

const loadLoginPage = function() {
  const todoPage = document.querySelector('.todoPage');
  todoPage.innerHTML = `<div class="loginPage">
        <h1>Sign In</h1>
        <div class="loginContainer">
          <input type="text" onfocus="setMsg('loginMsg','')" placeholder="Username" name="username"/>
          <div class = 'errorMsg' ></div>
          <input type="password" onfocus="setMsg('loginMsg','')" placeholder="Password" name="password" />
          <div class = 'errorMsg' id = 'loginMsg'></div>
          <div class = 'button'>
            <button onclick="sendAuthDetails('/login')" id="loginBtn">SIGN IN</button>
          </div>
          <div class= 'authLink'>
            Don't have account? 
            <a  onclick="loadSignUpPage()">Sign Up</a> here
          </div>
        </div>
      </div>`;
};

const loadTodoNav = function() {
  const nav = document.querySelector('.headers');
  nav.innerHTML = `<div class="heading">
        POST IT
      </div>
      <div class='todoNav'>
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
        </div>
      <div class='logoutBtn'>
        <button onclick="sendLogoutRequest()">logout</button>
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

const calledAfterAuth = function(status, responseText) {
  if (status === 403 && responseText === 'invalidUserNameOrPassword') {
    return setMsg('loginMsg', 'invalid userName or Password', 'red');
  }
  return serveTodo();
};
