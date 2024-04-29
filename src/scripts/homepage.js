const greeting = document.getElementById('welcome-message');

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

        console.log("getLoggedInUser: ", data);
    } catch (error) {
        console.error(error);
    }
}
getLoggedInUser();