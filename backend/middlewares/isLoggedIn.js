const jwt = require('jsonwebtoken');
const User = require('../models/user')
const isLoggedIn = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: "No token provided", authorized: false });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "Invalid token format", authorized: false });
    }


    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        const checkUser = await User.findOne({ email: decoded.email })
        if (!checkUser) {
            return res.status(403).json({ message: "Invalid User", authorized: false });

        }
        req.user = checkUser;
        next();
    } catch (err) {
        console.log('auth middleware', err.message);
        if (err.name === 'invalid token') {


            return res.status(401).json({ message: "Token has expired", authorized: false });
        }
        if (err.name === 'TokenExpiredError') {
            console.log(err.name);

            return res.status(401).json({ message: "Token has expired", authorized: false });
        }
        return res.status(401).json({ message: "Unauthorized", authorized: false });
    }
};

module.exports = { isLoggedIn };