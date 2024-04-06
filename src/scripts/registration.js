const { addUserToDb } = ('./database');

const email = document.getElementById('registration-email');
const username = document.getElementById('registration-username');
const fullName = document.getElementById('registration-fullname');
const password = document.getElementById('registration-password');
const registerButton = document.getElementById('register-button');
const radioButtons = document.querySelectorAll('input[name="profile-image"]');
const date = {
    "date": new Date().toLocaleString()
}

registerButton.addEventListener('click', async e => {
    e.preventDefault();

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
        await addUserToDb(username.value, {
            fullname: fullName.value,
            email: email.value,
            password: password.value,
            profileimage: selectedImageSrc
        });

        console.log('User added successfully to the database.');
    } catch (error) {
        console.error(error);
    }
});
