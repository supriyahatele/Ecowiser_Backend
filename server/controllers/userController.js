
require('dotenv').config()
const { UserModel } = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register route
const RegisterUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new UserModel({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        return res.status(201).send({ msg: 'user register successfully', user: user });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

// Login route
const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = { userId: user._id };
        jwt.sign(payload, process.env.SECRETKEY, { expiresIn: "12h" }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { RegisterUser, Login }