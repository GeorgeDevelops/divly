

const express = require('express');
const { User } = require('../models/user.js');
const bcrypt = require('bcrypt');
const app = express.Router();

// User authentication

app.post('/login', async (req, res) => {

    let user = await User.findOne({ email: req.body.email });
    if (!user || user == '') return res.status(400).send("Invalid email or password!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password!");

    const token = user.genToken();
    console.log(token)
    res.header('x-authentication-token', token).status(200).send({ message: "Logged In successfully", token: token });
});

module.exports = app;