var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var logger = require('../servicos/logger');

module.exports = function() {
    var app = express();

    app.use(morgan("common", {
        stream: {
            write: function(msg) {
                logger.info(msg);
            }
        }
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressValidator());

    consign()
        .include('controllers')
        .then('persistencia')
        .then('servicos')
        .into(app);
    return app;
}