const greeting = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logout-button');
const timelineDiv = document.getElementById('timeline');

async function fetchData() {
    try {
        // Fetch user data and post data together
        const [userDataResponse, postDataResponse] = await Promise.all([
            fetch("/get-users"),
            fetch("/get-posts")
        ]);

        const userData = await userDataResponse.json();
        const postData = await postDataResponse.json();

        console.log("getUserData: ", userData);
        console.log("getPostData: ", postData);

        // After fetching both data, render posts
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

function renderPosts(userData, postData) {
    timelineDiv.innerHTML = ''; // Clear previous content

    // Loop through each user's posts
    for (const username in postData) {
        const userPosts = postData[username];
        const sortedPosts = Object.values(userPosts).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        for (const post of sortedPosts) {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');

            // Use user data to get additional information for the post card
            const userInfo = userData[post.username];
            if (userInfo) {
                const userLink = document.createElement('a');
                userLink.href = `/profile/${post.username}`; // Assuming the URL structure for user profiles
                userLink.textContent = userInfo.name; // Assuming user data has a 'name' property
                postDiv.appendChild(userLink);

                const postAuthor = document.createElement('span');
                postAuthor.textContent = ` (${userInfo.username})`; // Display username after the name
                postDiv.appendChild(postAuthor);
            }

            const postContent = document.createElement('p');
            postContent.textContent = post.content;
            postDiv.appendChild(postContent);

            // Display post creation date
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

                // Display comment creation date
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

            // Add input field for new comment
            const newCommentInput = document.createElement('input');
            newCommentInput.setAttribute('type', 'text');
            newCommentInput.setAttribute('placeholder', 'Write your comment...');
            postDiv.appendChild(newCommentInput);

            // Add button to submit new comment
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
                        // Handle errors if any
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



// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}


// Fetch data and initialize UI
fetchData();
getLoggedInUser();

logoutBtn.addEventListener('click', logout);
