
'use strict';
/*
    SETUP
*/

const express = require('express');   // We are using the express library for the web server
var mysql = require('./db-connector.js');

var exprHandlebars = require('express-handlebars');
const app = express();            // We need to instantiate an express object to interact with the server in our code

//part of handlebars - dateformat module -- Used for displaying custom date format
const moment = require("moment");

//include custom handlebars helper function for formatting date
const handlebars = exprHandlebars.create({
    helpers: {
        dateFormat: function (date, options) {
            const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "MM/DD/YYYY"
            return moment(date).format(formatToUse);
        }
    },
    defaultLayout: 'main'
})

const PORT = 34118;

app.engine('handlebars', handlebars.engine);

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'handlebars');
app.set('mysql', mysql);

app.use('/static', express.static('public'));

app.use('/customers', require('./customers.js'));
app.use('/accounts', require('./accounts.js'));
app.use('/account_types', require('./account_types.js'));
app.use('/special_offers', require('./special_offers.js'));
app.use('/accounts_customers', require('./accounts_customers.js'));
app.use('/transactions', require('./transactions.js'));

app.use('/', express.static('public'));

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});