// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, child, get, push, set } = require('firebase/database');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const baseUrl = 'https://social-media-app-8f2ed-default-rtdb.europe-west1.firebasedatabase.app/users/';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2d5Bt_tBKKa38-zHhdPzJntffPrYqCkA",
  authDomain: "social-media-app-8f2ed.firebaseapp.com",
  databaseURL: "https://social-media-app-8f2ed-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "social-media-app-8f2ed",
  storageBucket: "social-media-app-8f2ed.appspot.com",
  messagingSenderId: "281917889263",
  appId: "1:281917889263:web:b3c64718ac2d4772b8991a"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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
  try {
    await set(ref(database, `users/${username}`), userData);
    console.log("User added successfully to the database.");
  } catch (error) {
    throw error;
  }
}

module.exports = { loginUser, addUserToDb }