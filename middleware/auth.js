
const jwt = require('jsonwebtoken');
const config = require('config');
const winston = require('winston');

module.exports = function (req, res, next) {
    const token = req.header('x-authentication-token');
    if (!token || token == '') res.status(401).send("No token provided.");

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded
        next();
    }
    catch (ex) {
        winston.error(ex)
        return res.status(400).send("Invalid token.");
    }
}