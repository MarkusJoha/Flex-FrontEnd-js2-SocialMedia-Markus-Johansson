const express = require('express');
const path = require('path');
const { loginUser, addUserToDb } = require('./src/scripts/database');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'loginpage.html'));
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

app.get('/get-users', async (req, res) => {

});

app.post('/register-user', async (req, res) => {
    console.log(req.body);
    const userData = { 
            fullName: req.body.userData.fullName,
            email: req.body.userData.email,
            password: req.body.userData.password,
            profileImage: req.body.userData.profileImage
    }
    console.log(userData);

    const registerUser = await addUserToDb(req.body.userData.username ,userData);

    console.log(registerUser);

    if (registerUser) {
        res.send({userCreated: true})
    } else {
        res.send({userCreated: false})
    }

});

app.post('/login', (req, res) => {

    res.sendFile(path.join(__dirname, 'src', 'views', 'loginpage.html'));
});

app.post('/homepage', (req, res) => {
    console.log(req.body.loginUsername);
    res.sendFile(path.join(__dirname, 'src', 'views', 'homepage.html'));
});

app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'homepage.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'registrationpage.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});