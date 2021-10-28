
'use strict';
/*
    SETUP
*/

const express = require('express');   // We are using the express library for the web server
const app = express();            // We need to instantiate an express object to interact with the server in our code
const PORT = 3000;


app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

//use public directory for serving static assets
app.use(express.static('public', { extensions: ['html'] }));

//Database -- for later
//var db = require('./db-connector')


/*
    ROUTES
*/


//routes to public/index.html
app.get("/", (req, res) => {
    res.send("Hello World!");
});


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


/*
    LISTENER
*/
app.listen(PORT, function () {            //'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});