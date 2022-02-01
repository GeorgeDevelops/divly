
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const error = require('../middleware/error');
const GenreRouterModule = require('../router/router.js');
const CostumerRouterModule = require('../router/costumer-router.js');
const MovieRouterModule = require('../router/movies.js');
const RentalRouterNodule = require('../router/rentals.js');
const UserRoutelModule = require('../router/users.js');
const AuthenticationModule = require('../router/auth.js');
const returnsRouterModule = require('../router/returns.js');

module.exports = function (app) {

    // Native Middleware 

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(morgan('tiny'));

    // Routes

    app.use('/', GenreRouterModule);
    app.use('/', CostumerRouterModule);
    app.use('/', MovieRouterModule);
    app.use('/', RentalRouterNodule);
    app.use('/', UserRoutelModule);
    app.use('/', AuthenticationModule);
    app.use('/', returnsRouterModule);

    // Errors logger

    app.use(error);
}