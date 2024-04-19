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

    const userData = {
        username: username.value,
        fullName: fullName.value,
        email: email.value,
        password: password.value,
        profileImage: selectedImageSrc
    }

    const response = await fetch("/register-user", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userData})
    });

    const data = await response.json();
    console.log(data);

    if (data.userCreated) {
        alert('User Created!');
        window.location.replace('loginpage');
    }
});
