
const winston = require('winston');

module.exports = function () {
    // winston logger
    winston.add(new winston.transports.File({ filename: 'errors.log', level: 'warn' }));
    winston.add(new winston.transports.Console({ format: winston.format.simple() }));
}