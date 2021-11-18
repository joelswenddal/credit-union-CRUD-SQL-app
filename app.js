
'use strict';
/*
    SETUP
*/

const express = require('express');   // We are using the express library for the web server
const { appendFileSync } = require('fs');
var mysql = require('./db-connector.js');
//var bodyParser = require('body-parser');
const app = express();            // We need to instantiate an express object to interact with the server in our code
const handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
})

const PORT = 34529;
app.engine('handlebars', handlebars.engine);
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'handlebars');
app.set('mysql', mysql);

app.use('/customers', require('./customers.js'));
app.use('/accounts', require('./accounts.js'));
app.use('/account_types', require('./account_types'));
app.use('/special_offers', require('./special_offers'));

app.use('/accounts_customers', require('./accounts_customers.js'));

app.use('/transactions', require('./transactions'));

//use public directory for serving static assets
//app.use(express.static('public', { extensions: ['html'] }));
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

/*
    ROUTES
*/


//routes to public/index.html
app.get("/", (req, res) => {
    res.send("Hello World!");
});

/*
app.post("/customers", function (req, res) {
    console.log(req.body);
    res.send("<p>Your request was received by the server.</p>"
        + "<p>" + `${JSON.stringify(req.body)}` + "</p>");
})


app.post("/account_types", function (req, res) {
    console.log(req.body);

    res.send("<p>Your request was received by the server.</p>"
        + "<p>" + `${JSON.stringify(req.body)}` + "</p>");
})

app.post("/accounts", function (req, res) {
    console.log(req.body);
    res.send("<p>Your request was received by the server.</p>"
        + "<p>" + `${JSON.stringify(req.body)}` + "</p>");
})

app.post("/transactions", function (req, res) {
    console.log(req.body);
    res.send("<p>Your request was received by the server.</p>"
        + "<p>" + `${JSON.stringify(req.body)}` + "</p>");
})
*/

/*
    LISTENER
*/
app.listen(PORT, function () {            //'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});