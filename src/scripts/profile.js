const homepageButton = document.getElementById('homepage-button');
const logoutBtn = document.getElementById('logout-button');

homepageButton.addEventListener('click', async () => {
    
    const response = await fetch("/homepage", {
        method: "GET",
    });
    
    if (response.ok) {
        window.location.replace('homepage'); 
    }
});

async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
        });
        const data = await response.json();
        if (data.success) {
            window.location.href = '/loginpage';
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error(error);
    }
}

logoutBtn.addEventListener('click', logout);

async function fetchUserProfile() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');

    try {
        const response = await fetch(`/api/user/${username}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const userData = await response.json();
        if (!userData) {
            document.getElementById('profile-info').innerText = 'User not found';
        } else {
            displayUserProfile(userData, username);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        document.getElementById('profile-info').innerText = 'Error fetching user data';
    }
}

function displayUserProfile(userData, username) {
    const profileInfoDiv = document.getElementById('profile-info');
    profileInfoDiv.innerHTML = `
        <img src="${userData.profileImage}" alt="Profile Image" />
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Full Name:</strong> ${userData.fullName}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
    `;
}


fetchUserProfile();