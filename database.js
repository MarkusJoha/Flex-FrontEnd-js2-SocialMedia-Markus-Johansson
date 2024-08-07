const baseUrl = 'https://social-media-app-8f2ed-default-rtdb.europe-west1.firebasedatabase.app/';

function generateUniqueId() {
  return `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

async function loginUser(username, password) {
  try {
    const res = await fetch(`${baseUrl}users/${username}.json`);
    const data = await res.json();

    if (data) {
      return data.password === password ? data : null;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function deleteUser(username) {
  try {
    fetch(`${baseUrl}users/${username}.json`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    fetch(`${baseUrl}posts/${username}.json`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

  } catch (error) {
    console.error(error);
  }
}

async function addUser(username, userData) {

  try {
    const userCheck = await getUser(username);
    console.log(userCheck);

    if (!userCheck) {
      const addUser = await fetch(`${baseUrl}users/${username}.json`, {
        method: "PUT",
        body: JSON.stringify(
          userData
        ),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      const data = await addUser.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

async function addPost(username, content, date) {
  try {
    const postId = generateUniqueId(); // Generate a unique ID
    const response = await fetch(`${baseUrl}posts/${username}/${postId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        content,
        created_at: date
      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });
    
    const data = await response.json();
    return postId; // Return the unique post ID
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function addComment(username, postId, postOwner, content, date) {
  try {
    const commentId = generateUniqueId(); // Generate a unique ID
    const response = await fetch(`${baseUrl}posts/${postOwner}/${postId}/comments/${commentId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        content,
        created_at: date,
        user: username
      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });

    const data = await response.json();
    return commentId; // Return the unique comment ID
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAllUsers() {
  try {
    const response = await fetch(`${baseUrl}users/.json`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getUser(username) {
  try {
      const response = await fetch(`${baseUrl}users/${username}.json`);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
  }
}

async function getUserPassword(username) {
  try {
    const response = await fetch(`${baseUrl}users/${username}/password.json`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getUserPosts(username) {
  try {
    const response = await fetch(`${baseUrl}posts/${username}.json`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAllPosts() {
  try {
    const response = await fetch(`${baseUrl}posts/.json`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = { loginUser, addUser, addPost, addComment, getAllUsers, getAllPosts, getUser, getUserPassword, getUserPosts, deleteUser }