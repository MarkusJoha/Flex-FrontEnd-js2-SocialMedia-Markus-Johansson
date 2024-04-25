const baseUrl = 'https://social-media-app-8f2ed-default-rtdb.europe-west1.firebasedatabase.app/users/';

async function loginUser(username, password) {
  try {
    const res = await fetch(baseUrl + `${username}.json`);
    const data = await res.json();

    if (data) {
      return data.password === password;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

async function addUserToDb(username, userData) {
  const addUser = await fetch(baseUrl + `${username}.json`, {
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

async function getAllUsers() {
  const response = await fetch(baseUrl + `.json`);
  const data = await response.json();

  return data;
}

module.exports = { loginUser, addUserToDb, getAllUsers }