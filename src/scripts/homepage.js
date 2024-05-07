const greeting = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logout-button');
const timelineDiv = document.getElementById('timeline');

async function fetchData() {
    try {
        const [userDataResponse, postDataResponse] = await Promise.all([
            fetch("/get-users"),
            fetch("/get-posts")
        ]);

        const userData = await userDataResponse.json();
        const postData = await postDataResponse.json();

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
        greeting.innerText = `Hej, ${data.username}!`;
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

function renderUsers(userData) {
    
}

function renderPosts(postData) {
    timelineDiv.innerHTML = '';

    for (const username in postData) {
        const userPosts = postData[username];
        const sortedPosts = Object.values(userPosts).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        for (const post of sortedPosts) {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');

            const postOwnerUsername = Object.keys(postData).find(key => postData[key] === userPosts);

            const userLink = document.createElement('a');
            userLink.href = `/profile/${postOwnerUsername}`; // Assuming the URL structure for user profiles
            userLink.textContent = postOwnerUsername; // Display username as post owner
            postDiv.appendChild(userLink);
            

            const postContent = document.createElement('p');
            postContent.textContent = post.content;
            postDiv.appendChild(postContent);

            const postDate = document.createElement('span');
            postDate.textContent = `Posted on: ${formatDate(post.created_at)}`;
            postDiv.appendChild(postDate);

            const commentsDiv = document.createElement('div');
            commentsDiv.classList.add('comments');

            const sortedComments = Object.values(post.comments).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            for (const comment of sortedComments) {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');

                const commentContent = document.createElement('p');
                commentContent.textContent = comment.content;
                commentDiv.appendChild(commentContent);

                const commentDate = document.createElement('span');
                commentDate.textContent = `Commented on: ${formatDate(comment.created_at)}`;
                commentDiv.appendChild(commentDate);

                const commenterLink = document.createElement('a');
                commenterLink.href = `/profile/${comment.user}`; // Assuming the URL structure for user profiles
                commenterLink.textContent = comment.user;
                commentDiv.appendChild(commenterLink);

                commentsDiv.appendChild(commentDiv);
            }

            postDiv.appendChild(commentsDiv);

            const newCommentInput = document.createElement('input');
            newCommentInput.setAttribute('type', 'text');
            newCommentInput.setAttribute('placeholder', 'Write your comment...');
            postDiv.appendChild(newCommentInput);

            const submitCommentBtn = document.createElement('button');
            submitCommentBtn.textContent = 'Add Comment';
            submitCommentBtn.addEventListener('click', async () => {
                const newCommentContent = newCommentInput.value.trim();
                if (newCommentContent) {
                    try {
                        const response = await fetch('/add-comment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                postId: post.id, // Assuming each post has an id
                                content: newCommentContent
                            })
                        });
                        const data = await response.json();
                        console.log(data); // Log the response from the server
                        // Optionally, you can update the UI to reflect the new comment
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    alert('Please enter a comment');
                }
            });
            postDiv.appendChild(submitCommentBtn);

            timelineDiv.appendChild(postDiv);
        }
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

fetchData();
getLoggedInUser();

logoutBtn.addEventListener('click', logout);
