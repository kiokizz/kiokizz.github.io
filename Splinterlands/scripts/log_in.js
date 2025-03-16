// Function to get a cookie by name
function getLoginCookie() {
  let cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    let [key, value] = cookie.split('=');
    if (key === `username`) return decodeURIComponent(value);
  }
  return null;
}

// Function to set a cookie
function setUser(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
}

// Function to clear a cookie
function clearUser(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// setUser("username", "JohnDoe", 7); // Expires in 7 days
// clearUser("username");
// TODO Username field and log in button.

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    // Check if the "username" cookie exists
    let logged_in = getLoginCookie();
    if (logged_in) {
      el(`login_status`).innerText = `You are logged in as @${logged_in}`
      el(`logged_in_msg`).innerText = `@${logged_in}`
      el(`login_btn`).innerText = `Change User`
    }

    let login_btn = el("login_btn")

    login_btn.onclick = function () {
      console.log(`Log_in clicked`)
      login_btn.disabled = true

      let username = el("username").value

      const hive_keychain = window.hive_keychain;
      const message = username + Date.now();
      hive_keychain.requestSignBuffer(username, message, 'Posting', (response) => {
        console.log(response)
        if (response.success) {
          setUser("username", username, 7); // Expires in 7 days
          show_user_votes()
          let logged_in = getLoginCookie("username");
          if (logged_in) {
            el(`login_status`).innerText = `You are logged in as @${logged_in}`
            el(`logged_in_msg`).innerText = `@${logged_in}`
          } else {
            el(`login_status`).innerText = `Unknown log in error:\n${response.message}`
          }
          login_btn.disabled = false
        } else {
          el(`login_status`).innerText = `Keychain verification failed:\n${response.message}`
          login_btn.disabled = false
        }
      });
    }
  }, 400);
});