module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getAccountsCustomers(res, mysql, context, complete) {
        mysql.pool.query("SELECT account_ID,customer_ID FROM accounts_customers ", function (error, results, fields) {

            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.accounts_customers = results;
            complete();
        });
    }

    function getCustomers(res, mysql, context, complete) {
        mysql.pool.query("SELECT customer_ID FROM customers ", function (error, results, fields) {

            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.customers = results;
            complete();
        });
    }

    function getAccounts(res, mysql, context, complete) {
        mysql.pool.query("SELECT account_ID FROM accounts", function (error, results, fields) {

            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.accounts = results;
            complete();
        });
    }

    /*Display all Accounts_Customers relationships*/
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        getAccountsCustomers(res, mysql, context, complete);
        getAccounts(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('accounts_customers', context);
            }
        }
    });

    /*Adds an Accounts_Customers relationship, redirects to Accounts_Customers page after adding*/
    router.post('/', function (req, res) {
        console.log(req.body)
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO accounts_customers (account_ID, customer_ID) VALUES(?, ?)";
        let inserts = [req.body.accountID, req.body.customerID];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/accounts_customers');
            }
        });
    });


    return router;
}();