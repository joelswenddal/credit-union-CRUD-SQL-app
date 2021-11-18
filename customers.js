module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getCustomers(res, mysql, context, complete) {
        mysql.pool.query("SELECT customer_ID,ssn, first_name,middle_name,last_name,dob, street_address, city, state, zip, phone_number, email FROM customers ",
        function (error, results, fields) {

            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.customers = results;
            complete();
        });
    }


    /*Display all customers*/
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('customers', context);
            }
        }
    });

    /*Adds a Customer, redirects to Customer page after adding*/

    router.post('/', function (req, res) {
        console.log(req.body)
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO customers (first_name, middle_name, last_name, \
            ssn, dob, street_address, city, state, zip, phone_number, email) VALUES (?, ?, ?, ?, \
            ?, ?, ?, ?, ?, ?, ?)";
        let inserts = [req.body.firstName, req.body.middleName, req.body.lastName,
        req.body.ssn, req.body.dob, req.body.street, req.body.city, req.body.state, req.body.zip,
        req.body.phone, req.body.email];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/customers');
            }
        });
    });

    return router;
}();