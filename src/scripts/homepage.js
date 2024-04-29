const greeting = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logout-button');

async function getUserData() {

    try {
        const response = await fetch("/get-users");

        const data = await response.json();
        console.log("getUserData: ", data);
    } catch (error) {
        console.error(error);
    }
}
getUserData();

async function getPostData() {
    try {
        const response = await fetch("/get-posts");
        const data = await response.json();

        console.log("getPostData: ", data);
    } catch (error) {
        console.error(error);
    }
}
getPostData();

async function getLoggedInUser() {
    try {
        const response = await fetch('/get-loggedin-user');
        const data = await response.json();

        greeting.innerText = `Hej, ${data.username}!`;
    } catch (error) {
        console.error(error);
    }
}
getLoggedInUser();

logoutBtn.addEventListener('click', async () => {
    const response = await fetch('/logout', {
        method: 'POST',
    });
    const data = await response.json();
    if (data.success) {
        window.location.href = '/loginpage';
    } else {
        alert('Logout failed. Please try again.');
    }
});