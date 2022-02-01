
const config = require('config');

module.exports = function () {
    if (!config.get('jwtPrivateKey') || config.get('jwtPrivateKey') == '') {
        console.log("FATAL ERROR: Secret key is not defined.");
        process.exit(1);
    }

}