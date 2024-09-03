const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJwtToken = (payload) => {
    if (!process.env.SECRET) {
        throw new Error('SECRET environment variable is not set');
    }
    return jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' })
}

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required", created: false });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists", created: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hash,
        });
        const token = generateJwtToken({ email })

        res.status(201).json({ message: "User created successfully", token, user, created: true })

    } catch (err) {


        res.status(500).json({ message: "Something went wrong", error: err.message, created: false })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", status: false });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials", status: false });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", status: false });
        }

        const token = generateJwtToken({ email });


        res.status(201).json({ message: "Login successful", user: existingUser, token, status: true });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message, status: false });
    }
};

const logout = (req, res) => {


    res.status(200).json({ message: 'Successfully logged out' });

}

module.exports = { register, login, logout }