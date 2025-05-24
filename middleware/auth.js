const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        
        if (!token) {
            // If no token, redirect to login page

           throw new Error('No token provided');
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            // If user not found, redirect to login page
           throw new Error('User not found');
        }
        
        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        // If token is invalid, redirect to login page
        console.log(error);
        return res.redirect('http://localhost:8000/login');
    }
};

module.exports = auth;