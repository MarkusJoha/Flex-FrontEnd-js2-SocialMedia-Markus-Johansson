import { getDb } from "./database";

const email = document.getElementById('login-email');
const password = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');

loginButton.onclick = async function (event) {
    event.preventDefault();
}