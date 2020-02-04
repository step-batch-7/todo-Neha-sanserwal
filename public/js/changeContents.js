const changeMainPageContent = function(status, responseText, contentClass) {
  if (status === 200) {
    document.getElementsByClassName(contentClass)[0].innerHTML = responseText;
  }
};
