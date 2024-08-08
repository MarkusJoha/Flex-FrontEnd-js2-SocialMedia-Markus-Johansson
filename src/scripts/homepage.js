const greeting = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logout-button');
const deleteAccountBtn = document.getElementById('delete-account-button');
const confirmDeleteBtn = document.getElementById('confirm-delete-button');
const timelineDiv = document.getElementById('timeline');
const userLinksDiv = document.getElementById('profile-links');
const postForm = document.getElementById('post-submission-form');
let user;

function formatDateToMinute(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}`;
}

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

async function addPost(postContent) {
    try {
        const response = await fetch('/add-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user,
                content: postContent
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add post');
        }

        const data = await response.json();
        if (data.success) {
            console.log('Post added successfully:', data.postData);
            const newPostElement = createPostElement(data.postData.user, data.postData.post, formatDateToMinute(data.postData.created_at));
            timelineDiv.insertBefore(newPostElement, timelineDiv.firstChild);
        } else {
            console.error('Error adding post:', data.error);
        }
    } catch (error) {
        console.error('Error adding post:', error);
    }
}

postForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const postContent = document.getElementById('post-submission-input').value;
    if (postContent) {
        addPost(postContent);
        event.target.reset();
    }
});

async function postComment(postId, commentContent, postElement) {
    try {
        const response = await fetch('/add-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId,
                username: user,
                content: commentContent
            })
        });

        if (!response.ok) {
            throw new Error('Failed to post comment');
        }

        const data = await response.json();
        console.log(data);

        if (data.success) {
            console.log('Comment added successfully:', data.commentData);
            const newCommentElement = createCommentElement(data.commentData);
            postElement.appendChild(newCommentElement);
        } else {
            console.error('Error adding comment:', data.error);
        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';

    const postContent = document.createElement('p');
    console.log(post);

    postContent.textContent = `${post.user} (${formatDateToMinute(post.created_at)}): ${post.post}`;
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
    commentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const commentContent = event.target.comment.value;
        console.log('postElement: ', postElement, 'commentContent: ', commentContent, 'post: ', post);

        if (commentContent) {
            postComment(post.id, commentContent, postElement);
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
    commentContent.textContent = `${comment.user} (${formatDateToMinute(comment.created_at)}): ${comment.content}`;
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
                post: post.content,
                created_at: post.created_at,
                id: postId
            });
        }
    }

    postsArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    for (const postObject of postsArray) {
        const postElement = createPostElement(postObject);
        console.log(postObject.id);

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