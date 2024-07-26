const express = require('express');
const session = require('express-session');
const path = require('path');
const { loginUser, addUser, addPost, addComment, getAllUsers, getAllPosts, getUser, getUserPassword, getUserPosts, deleteUser } = require('./database');
const filePath = path.join(__dirname, 'src', 'views');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'src')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

function requireLogin(req, res, next) {
    if (req.session && req.session.username) {
        return next();
    }
    else {
        res.redirect('/loginpage');
    }
}

function destroySession(session, res) {
    session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(filePath, 'loginpage.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(filePath, 'registrationpage.html'));
});

app.get('/loginpage', (req, res) => {
    res.sendFile(path.join(filePath, 'loginpage.html'));
});

app.get('/homepage', requireLogin, async (req, res) => {
    res.sendFile(path.join(filePath, 'homepage.html'));
});

app.get('/profilepage', requireLogin, (req, res) => {
    res.sendFile(path.join(filePath, 'profilepage.html'));
});

app.get('/api/user/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const userData = await getUser(username);
        console.log(`Fetched user data for ${username}:`, userData); // Debugging log

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/login-attempt', async (req, res) => {
    try {
        const { username, password } = req.body;

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
        const { username, fullName, email, password, profileImage } = req.body.userData;
        const userData = {
            fullName,
            email,
            password,
            profileImage
        }

        const registerUser = await addUser(username, userData);

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

app.post('/logout', (req, res) => {
    destroySession(req.session, res);
});

app.delete('/delete-user', async (req, res) => {
    const { password, username } = req.body;
    const userPassword = await getUserPassword();

    if (userPassword === password) {
        destroySession(req.session, res);
        deleteUser(username);

        res.json(true);
    }
    else {
        res.json(null);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});