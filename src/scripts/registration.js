import { getDb } from "./database";

const email = document.getElementById('registration-email');
const fullName = document.getElementById('registration-name');
const password = document.getElementById('registration-password');
const registerButton = document.getElementById('register-button');
const images = document.querySelectorAll('input[name="profile-image"]');
const date = {
    "date": new Date().toLocaleString()
}

registerButton.onclick = async function (event) {

    event.preventDefault();

    let selectedImageSrc = '';
    images.forEach(image => {
        if (image.checked) {
            selectedImageSrc = image.value;
        }
    });

    console.log('Email: ', email.value);
    console.log('Name: ', fullName.value);
    console.log('Password: ', password.value);
    console.log('Profile Image: ', selectedImageSrc);

    try {
        const db = await getDb(); 
        console.log(db);
    } catch (error) {
        console.error(error);
    }
};
