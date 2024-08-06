const greeting = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logout-button');
const deleteAccountBtn = document.getElementById('delete-account-button');
const confirmDeleteBtn = document.getElementById('confirm-delete-button');
const timelineDiv = document.getElementById('timeline');
const userLinksDiv = document.getElementById('profile-links');
let user;

async function fetchData() {
    try {
        const [userDataResponse, postDataResponse] = await Promise.all([
            fetch("/get-users"),
            fetch("/get-posts")
        ]);

        const [userData, postData] = await Promise.all([
            userDataResponse.json(),
            postDataResponse.json()
        ]);

        console.log("getUserData: ", userData);
        console.log("getPostData: ", postData);

        displayUserLinks(userData);
        displayPosts(postData);
    } catch (error) {
        console.error(error);
    }
}

async function getLoggedInUser() {
    try {
        const response = await fetch('/get-loggedin-user');
        const data = await response.json();
        user = data.username;
        greeting.innerText = `Greetings, ${user}!`;
        console.log(user);
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

async function deleteUser() {
    const passwordInput = document.getElementById('password-input').value;
    try {
        const response = await fetch('/delete-user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: passwordInput, username: user })
        });
        const data = await response.json();
        console.log('Server response:', data); 

        if (data.success) {
            alert('User has been deleted!');
            window.location.href = '/loginpage';
        } else {
            alert('Password incorrect. Please try again.');
        }
    } catch (error) {
        console.error(error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function createPostElement(user, post, timestamp) {
    const postElement = document.createElement('div');
    postElement.className = 'post';

    const postContent = document.createElement('p');
    postContent.textContent = `${user} (${timestamp}): ${post.content}`;
    postElement.appendChild(postContent);

    if (post.comments) {
        const sortedComments = Object.values(post.comments).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        for (const comment of sortedComments) {
            const commentElement = createCommentElement(comment);
            postElement.appendChild(commentElement);
        }
    }

    const commentForm = document.createElement('form');
    commentForm.className = 'comment-form';
    commentForm.innerHTML = `
        <input type="text" name="comment" placeholder="Write a comment..." required>
        <button type="submit">Post Comment</button>
    `;
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const commentContent = event.target.comment.value;
        if (commentContent) {
            postComment(user, post, commentContent, postElement);
            event.target.reset();
        }
    });
    postElement.appendChild(commentForm);

    return postElement;
}

function createCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';

    const commentContent = document.createElement('p');
    commentContent.textContent = `${comment.user} (${formatDate(comment.created_at)}): ${comment.content}`;
    commentElement.appendChild(commentContent);

    return commentElement;
}

function displayPosts(postData) {
    const postsArray = [];

    for (const user in postData) {
        for (const postId in postData[user]) {
            const post = postData[user][postId];
            postsArray.push({
                user: user,
                post: post,
                created_at: post.created_at
            });
        }
    }

    postsArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    for (const postObject of postsArray) {
        const postElement = createPostElement(postObject.user, postObject.post, formatDate(postObject.created_at));
        timelineDiv.appendChild(postElement);
    }
}

function displayUserLinks(userData) {
    for (const username in userData) {
        const userLink = document.createElement('a');
        userLink.href = `/profilepage?username=${encodeURIComponent(username)}`;
        userLink.textContent = username;
        userLinksDiv.appendChild(userLink);
    }
}

fetchData();
getLoggedInUser();

logoutBtn.addEventListener('click', logout);
confirmDeleteBtn.addEventListener('click', deleteUser);
