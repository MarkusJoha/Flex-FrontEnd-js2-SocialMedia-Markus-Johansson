const { loginUser } = require('./database');

const usernameEl = document.getElementById('login-username');
const passwordEl = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', async e => {
    e.preventDefault();

    const username = usernameEl.value;
    const password = passwordEl.value;
    
    try {
        const isLoggedIn = await loginUser(username, password);
        
        if (isLoggedIn) {
            fetch('/login-success', { method: 'POST' });
        } else {
            console.log("Incorrect username or password.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
    }
});
