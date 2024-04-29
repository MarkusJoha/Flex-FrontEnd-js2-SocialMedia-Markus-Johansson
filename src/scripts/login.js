const usernameEl = document.getElementById('login-username');
const passwordEl = document.getElementById('login-password');
const formEl = document.getElementById("login-form");

formEl.addEventListener("submit", async e => {
    e.preventDefault();

    const username = usernameEl.value;
    const password = passwordEl.value;

    const cred = { username, password };

    const response = await fetch("/login-attempt", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cred)
    });

    if (response.ok) {
        const data = await response.json();
        if (data.username) {
            console.log(data);
            window.location.replace('homepage'); 
        } else {
            alert("Failed to login! Wrong credentials");
        }
    } else {
        console.error('Failed to login:', response.status);
    }
});