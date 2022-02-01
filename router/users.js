
const auth = require('../middleware/auth.js');
const express = require('express');
const { User } = require('../models/user.js');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const app = express.Router();

// Register

app.post('/divly/new/user', async (req, res) => {
    const body = req.body;

    if (!body) return res.status(400).send("Invalid data");
    if (!body.name || body.name == '') return res.status(400).send("Name is mandatory");

    if (!body.email || body.email == '') return res.status(400).send("Email is mandatory");
    if (body.password.length < 8) return res.status(400).send("Password most be at least 8 characters long.")
    if (!body.password || body.password == '') return res.status(400).send("Password is mandatory");

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("This user email is already registered");

    user = await new User({
        name: body.name,
        email: body.email,
        password: body.password,
        isAdmin: body.isAdmin
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user.save();

    const token = user.genToken();

    res.header('x-authentication-token', token).status(200).send(_.pick(user, ['_id', 'name', 'email'], token));
});

module.exports = app;