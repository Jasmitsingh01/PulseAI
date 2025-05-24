const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');
const registerController = require('../controllers/register');
const chatController = require('../controllers/chat');
const auth = require('../middleware/auth');
const path = require('path')


// render html
router.get('/', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/main.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'))
})





// API routes

router.post('/api/auth/login', loginController.login);
router.post('/api/auth/register', registerController.register);
router.post('/api/chat', auth, chatController.chat);
router.get('/api/auth/user', auth, (req, res) => {
    res.json({ user: req.user });
});

router.get('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('user');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
