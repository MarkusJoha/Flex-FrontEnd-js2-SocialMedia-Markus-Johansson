async function fetchUserProfile() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    
    if (!username) {
        document.getElementById('profile-info').innerText = 'No username provided';
        return;
    }

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
        <img src="${userData.profileImage || userData.profileimage}" alt="Profile Image" />
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Full Name:</strong> ${userData.fullName || userData.fullname}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
    `;
}


fetchUserProfile();