const express = require('express');
const session = require('express-session');
const path = require('path');
const { loginUser, addUserToDb, getAllUsers, getAllPosts } = require('./src/scripts/database');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'src')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
}));

function requireLogin(req, res, next) {
    if (req.session && req.session.username) {
        return next();
    }
    else {
        res.redirect('/loginpage');
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'loginpage.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'registrationpage.html'));
});

app.get('/loginpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'loginpage.html'));
});

app.get('/homepage', requireLogin, async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'homepage.html'));
});

app.get('/profilepage', requireLogin, async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'profilepage.html'));
});

app.post('/login-attempt', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const loggedIn = await loginUser(username, password);

        if (loggedIn) {
            req.session.username = username;
            res.send({ username });
        } else {
            res.send({ username: null });
        }
    } catch (error) {
        console.error(error);
        res.send({ username: null });
    }
});

app.post('/register-user', async (req, res) => {

    try {
        const username = req.body.userData.username;
        const userData = {
            fullName: req.body.userData.fullName,
            email: req.body.userData.email,
            password: req.body.userData.password,
            profileImage: req.body.userData.profileImage
        }

        const registerUser = await addUserToDb(username, userData);

        if (registerUser) {
            res.send({ userCreated: true });
        } else {
            res.send({ userCreated: false });
        }
    } catch (error) {
        console.error(error);
        res.send({ userCreated: false });
    }

});

app.get('/get-users', async (req, res) => {
    const userInfo = await getAllUsers();
    res.json(userInfo);
    //console.log(userInfo);
});

app.get('/get-loggedin-user', async (req, res) => {
    const loggedInUsername = req.session.username;
    res.send({ username: loggedInUsername });
});

app.get('/get-posts', async (req, res) => {
    const postInfo = await getAllPosts();
    res.json(postInfo);
    //console.log(postInfo);
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});