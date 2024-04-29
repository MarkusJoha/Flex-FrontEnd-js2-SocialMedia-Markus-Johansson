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

async function addUserToDb(username, userData) {
  try {
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

module.exports = { loginUser, addUserToDb, getAllUsers, getAllPosts }