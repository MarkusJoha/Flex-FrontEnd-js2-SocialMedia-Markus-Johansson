const express = require('express');
const session = require('express-session');
const path = require('path');
const {
    loginUser, addUser, addPost, addComment,
    getAllUsers, getAllPosts, getUser,
    getUserPassword, getUserPosts, deleteUser
} = require('./database');
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

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

function requireLogin(req, res, next) {
    if (req.session && req.session.username) {
        return next();
    } else {
        res.redirect('/loginpage');
    }
}

async function destroySession(session) {
    return new Promise((resolve, reject) => {
        session.destroy((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
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
        };

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
});

app.get('/get-loggedin-user', async (req, res) => {
    const loggedInUsername = req.session.username;
    res.send({ username: loggedInUsername });
});

app.get('/get-posts', async (req, res) => {
    const postInfo = await getAllPosts();
    res.json(postInfo);
});

app.get('/get-user-posts/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const postInfo = await getUserPosts(username);
        if (!postInfo) {
            return res.status(404).json({ error: 'Posts not found' });
        }
        res.json(postInfo);
    } catch (error) {
        console.error(`Error fetching posts for ${username}:`, error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/add-post', async (req, res) => {
    try {
        const { username, content } = req.body;
        const created_at = new Date().toISOString();

        const newPost = {
            user: username,
            content: content,
            created_at: created_at,
        };
        
        const postId = await addPost(newPost);

        res.json({
            success: true,
            postData: {
                user: username,
                id: postId,
                post: content,
                created_at: created_at
            }
        });
    } catch (error) {
        console.error('Error adding post:', error);
        res.json({ success: false, error: 'Failed to add post' });
    }
});

app.post('/add-comment', requireLogin, async (req, res) => {
    const { username } = req.session;
    const { postId, postOwner, content } = req.body;
    const date = new Date().toISOString();

    try {
        const commentData = await addComment(username, postId, postOwner, content, date);
        console.log(commentData);
        

        if (commentData) {
            res.json({ success: true, commentData });
        } else {
            res.status(500).json({ success: false, error: 'Failed to add comment' });
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.post('/logout', async (req, res) => {
    try {
        await destroySession(req.session);
        res.clearCookie('connect.sid');
        res.json({ success: true });
    } catch (error) {
        console.error('Error destroying session:', error);
        res.json({ success: false });
    }
});

app.delete('/delete-user', async (req, res) => {
    const { password, username } = req.body;

    try {
        const userPassword = await getUserPassword(username);

        if (userPassword === password) {
            await destroySession(req.session);
            await deleteUser(username);
            res.clearCookie('connect.sid');
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Password incorrect' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
