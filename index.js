
// require('winston-mongodb');
const winston = require('winston');
const emitterEvent = require('events');
const emitter = new emitterEvent();
const express = require('express');
const app = express();

// Startup

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/essentialConfig')();

// Uncaught and Unhandled Emitters

process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

// Log Environment Variable

console.log("Environment: " + process.env.NODE_ENV);

// Emitter Event Listeners

emitter.on('genres', () => {
    console.log("genres called")
});
emitter.on('connection', () => {
    console.log("New connection...")
});

// Setting port

var port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
    port = process.env.PORT || 5000;
}

const Server = app.listen(port, () => { winston.info("Listening on port " + port + "..."); });

module.exports = Server;