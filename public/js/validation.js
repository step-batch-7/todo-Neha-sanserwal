const setMsg = function(id, msg, color) {
  const errorBox = document.querySelector(`#${id}`);
  errorBox.innerHTML = msg;
  errorBox.style.color = color;
};

const checkErrorInAuth = function(type) {
  const inputs = Array.from(document.querySelectorAll('input'));
  const empty = inputs.some(input => input.value === '');
  if (empty) {
    return setMsg('commonMsg', 'please fill all the fields', 'red');
  }
  setMsg('commonMsg', '', 'green');
  const errorBoxes = Array.from(document.querySelectorAll('.errorMsg'));
  const error = errorBoxes.some(box => box.style.color === 'red');
  if (error) {
    return;
  }
  sendAuthDetails(type);
};

const calledAfterUserAvail = function(status, responseText) {
  const signup = document.querySelector('#signUpBtn');
  if (responseText === 'userAlreadyExists' && status === 422) {
    return setMsg('usernameMsg', 'username already exists', 'red');
  }
  setMsg('usernameMsg', 'username available', 'green');
};

const showPassNotMatchError = function() {
  const confirmPass = document.querySelector('input[name="confirmPass"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const signup = document.querySelector('#signUpBtn');
  if (password && password === confirmPass) {
    return setMsg('confirmPassMsg', 'password matched', 'green');
  }
  setMsg(
    'confirmPassMsg',
    'The password you entered did not matched. Please re-enter your password.',
    'red'
  );
};

const clearErrorMsg = function(...args) {
  args.forEach(function(msg) {
    setMsg(msg, '', 'green');
  });
};
