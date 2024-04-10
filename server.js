const express = require('express');
const path = require('path');
const { loginUser } = require('./src/scripts/database');

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

app.get('/login', (req, res) => {
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