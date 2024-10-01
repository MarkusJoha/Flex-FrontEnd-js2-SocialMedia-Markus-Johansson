const homepageButton = document.getElementById('homepage-button');
const logoutBtn = document.getElementById('logout-button');
const deleteAccountBtn = document.getElementById('delete-account-button');
const confirmDeleteBtn = document.getElementById('confirm-delete-button');
let user;
let username;

function formatDateToMinute(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

async function getLoggedInUser() {
    try {
        const response = await fetch('/get-loggedin-user');
        const data = await response.json();
        user = data.username;
        console.log(user);
    } catch (error) {
        console.error(error);
    }
}

homepageButton.addEventListener('click', async () => {
    const response = await fetch("/homepage", {
        method: "GET",
    });

    if (response.ok) {
        window.location.replace('homepage');
    }
});

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

logoutBtn.addEventListener('click', logout);

async function fetchUserProfile() {

    const params = new URLSearchParams(window.location.search);
    username = params.get('username');

    try {
        const response = await fetch(`/api/user/${username}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const userData = await response.json();
        if (!userData) {
            document.getElementById('profile-info').innerText = 'User not found';
        } else {
            displayUserProfile(userData, username);
            fetchUserPosts(username);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        document.getElementById('profile-info').innerText = 'Error fetching user data';
    }
}

function displayUserProfile(userData, username) {
    const profileInfoDiv = document.getElementById('profile-info');
    profileInfoDiv.innerHTML = `
        <img src="${userData.profileImage}" alt="Profile Image" class="profile-image" />
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Full Name:</strong> ${userData.fullName}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
    `;
}

async function disableDeleteButton() {
    console.log('user page: ' + username, 'logged in: ' + user);
    

    if (username != user) {
        deleteAccountBtn.hidden = true;
    }
}

async function fetchUserPosts(username) {
    try {
        const response = await fetch(`/get-user-posts/${username}`);
        if (response.status === 404) {
            displayUserPosts(null, username);
            return;
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const postData = await response.json();
        console.log(`Fetched posts for ${username}:`, postData);
        displayUserPosts(postData, username);
    } catch (error) {
        console.error('Error fetching user posts:', error);
    }
}

function displayUserPosts(postData, username) {
    const postsDiv = document.getElementById('profile-posts');
    postsDiv.innerHTML = '';

    if (!postData || Object.keys(postData).length === 0) {
        postsDiv.innerHTML = '<h3>No posts yet...</h3>';
        return;
    }

    for (const postId in postData) {
        const post = postData[postId];
        const postElement = document.createElement('div');
        postElement.className = 'post';

        postElement.innerHTML = `
            <p><strong>Post Content:</strong> ${post.content}</p>
            <p><strong>Created At:</strong> ${formatDateToMinute(post.created_at)}</p>
        `;

        if (post.comments) {
            const commentsDiv = document.createElement('div');
            commentsDiv.className = 'comments';
            for (const commentId in post.comments) {
                const comment = post.comments[commentId];
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <p><strong>Comment:</strong> ${comment.content}</p>
                    <p><strong>By:</strong> ${comment.user}</p>
                    <p><strong>Created At:</strong> ${formatDateToMinute(comment.created_at)}</p>
                `;
                commentsDiv.appendChild(commentElement);
            }
            postElement.appendChild(commentsDiv);
        }

        const commentForm = document.createElement('form');
        commentForm.className = 'comment-form';
        commentForm.innerHTML = `
            <div>
                <input type="text" name="comment" class="form-control" placeholder="Add a comment" required />
                <button type="submit" class="btn btn-primary">Post Comment</button>
            </div>
        `;

        commentForm.onsubmit = async (event) => {
            event.preventDefault();
            const commentInput = event.target.elements.comment.value;
            await addComment(username, postId, commentInput);
            fetchUserPosts(username);
        };

        postElement.appendChild(commentForm);

        postsDiv.appendChild(postElement);
    }
}

async function addComment(username, postId, content) {
    try {
        const response = await fetch('/add-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId, postOwner: username, content }),
        });

        if (!response.ok) {
            throw new Error('Failed to add comment');
        }

        const data = await response.json();
        if (data.success) {
            console.log('Comment added successfully:', data.commentData);
        } else {
            console.error('Error adding comment:', data.error);
        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

async function startUp() {
    await fetchUserProfile();
    await getLoggedInUser();
    await disableDeleteButton();   
}

startUp();
confirmDeleteBtn.addEventListener('click', deleteUser);