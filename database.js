const baseUrl = 'https://social-media-app-8f2ed-default-rtdb.europe-west1.firebasedatabase.app/';

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
    fetch(`${baseUrl}user/${username}.json`, {
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
    const addPost = await fetch(`${baseUrl}posts/${username}.json`, {
      method: "PUT",
      body: JSON.stringify(
        content, date
      ),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    const data = await addPost.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function addComment(username, postId, postOwner, content, date) {
  try {
    const addComment = await fetch(`${baseUrl}posts/${postOwner}/${postId}/comments.json`, {
      method: "PUT",
      body: JSON.stringify(
        content, date, username
      ),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    const data = await addComment.json();
    return data;
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
    console.error(error);
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