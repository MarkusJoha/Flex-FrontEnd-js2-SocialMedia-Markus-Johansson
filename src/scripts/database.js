// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, push, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2d5Bt_tBKKa38-zHhdPzJntffPrYqCkA",
  authDomain: "social-media-app-8f2ed.firebaseapp.com",
  databaseURL: "https://social-media-app-8f2ed-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "social-media-app-8f2ed",
  storageBucket: "social-media-app-8f2ed.appspot.com",
  messagingSenderId: "281917889263",
  appId: "1:281917889263:web:b3c64718ac2d4772b8991a"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export async function getDb() {
  try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `users/`));
      if (snapshot.exists()) {
          return snapshot.val();
      } else {
          throw new Error("No data available");
      }
  } catch (error) {
      throw error;
  }
}

export async function addUserToDb(username, userData) {
  try {
    await set(ref(database, `users/${username}`), userData);
    console.log("User added successfully to the database.");
  } catch (error) {
    throw error;
  }
}


