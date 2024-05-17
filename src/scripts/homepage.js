const greeting = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logout-button');
const deleteBtn = document.getElementById('')
const timelineDiv = document.getElementById('timeline');
let user;

async function fetchData() {
    try {
        const [userDataResponse, postDataResponse] = await Promise.all([
            fetch("/get-users"),
            fetch("/get-posts")
        ]);

        const [userData, postData] = [await userDataResponse.json(), await postDataResponse.json()];

        console.log("getUserData: ", userData);
        console.log("getPostData: ", postData);

        renderPosts(userData, postData);
    } catch (error) {
        console.error(error);
    }
}

async function getLoggedInUser() {
    try {
        const response = await fetch('/get-loggedin-user');
        const data = await response.json();
        user = data.username;
        greeting.innerText = `Hej, ${user}!`;
        
    } catch (error) {
        console.error(error);
    }
}

async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
        });
        const data = await response.json();
        if (data.success) {
            window.location.href = '/loginpage';
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error(error);
    }
}

function deleteUser() {
    
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}


fetchData();
getLoggedInUser();

logoutBtn.addEventListener('click', logout);
