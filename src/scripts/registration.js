import { addUserToDb } from "./database";

const email = document.getElementById('registration-email');
const username = document.getElementById('registration-username');
const fullName = document.getElementById('registration-fullname');
const password = document.getElementById('registration-password');
const registerButton = document.getElementById('register-button');
const radioButtons = document.querySelectorAll('input[name="profile-image"]');
const date = {
    "date": new Date().toLocaleString()
}

registerButton.onclick = async function (event) {
    event.preventDefault();

    let selectedImageSrc = '';
    radioButtons.forEach(image => {
        if (image.checked) {
            selectedImageSrc = image.value;
        }
    });

    console.log('Email: ', email.value);
    console.log('Username: ', username.value);
    console.log('Name: ', fullName.value);
    console.log('Password: ', password.value);
    console.log('Profile Image: ', selectedImageSrc);

    try {
        // Add user data to the database
        await addUserToDb(username.value, {
            fullname: fullName.value,
            email: email.value,
            password: password.value,
            profileimage: selectedImageSrc
            // Add other user data as needed
        });

        console.log('User added successfully to the database.');
    } catch (error) {
        console.error(error);
    }
};
