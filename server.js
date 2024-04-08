const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { loginUser } = require('./src/scripts/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'loginpage.html'));
});

app.post('/login-success', (req, res) => {
    const logggedIn = loginUser(req.body.loginUsername, req.body.loginPassword);

    if (logggedIn) {
        console.log(req.body.loginUsername);
        console.log(req.body.loginPassword);
        res.sendFile(path.join(__dirname, 'src', 'views', 'homepage.html'));
    }
});

app.get('/login', (req, res) => {
    console.log(PORT);
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
