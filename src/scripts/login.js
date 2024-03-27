import { loginUser } from "./database";

const usernameEl = document.getElementById('login-username');
const passwordEl = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', async e => {
    e.preventDefault();

    const username = usernameEl.value;
    const password = passwordEl.value;
    const LoggedInUser = await loginUser(username, password);
    console.log(LoggedInUser);

});