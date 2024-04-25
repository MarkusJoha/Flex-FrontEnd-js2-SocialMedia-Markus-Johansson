const express = require('express');
const path = require('path');
const { loginUser, addUserToDb, getAllUsers } = require('./src/scripts/database');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'loginpage.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'registrationpage.html'));
});

app.get('/loginpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'loginpage.html'));
});

app.get('/homepage', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'homepage.html'));
});

app.post('/login-attempt', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const loggedIn = await loginUser(username, password);

    if (loggedIn) {
        res.send({ username });
    } else {
        res.send({ username: null });
    }

});

app.post('/register-user', async (req, res) => {
    const username = req.body.userData.username;
    const userData = {
        fullName: req.body.userData.fullName,
        email: req.body.userData.email,
        password: req.body.userData.password,
        profileImage: req.body.userData.profileImage
    }
    console.log(userData);

    const registerUser = await addUserToDb(username, userData);

    console.log(registerUser);

    if (registerUser) {
        res.send({ userCreated: true })
    } else {
        res.send({ userCreated: false })
    }

});

app.get('/get-users', async (req, res) => {
    const userInfo = await getAllUsers();
    res.json(userInfo);
    console.log(userInfo);
});

app.get('/get-posts', async (req, res) => {

});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});