module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getAccounts(res, mysql, context, complete) {
        mysql.pool.query("SELECT account_ID,account_type,balance FROM accounts", function (error, results, fields) {

            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.accounts = results;
            complete();
        });
    }

    /*dropdown function*/
    function getTypes(res, mysql, context, complete) {
        mysql.pool.query("SELECT account_type FROM account_types", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.types = results;
            complete();
        });
    }

    /*Display all accounts*/
    router.get('/', function (req, res) {
        
        let callbackCount = 0;
        let context = {};

        context.jsscripts = ["deletecustomer.js","filtercustomers.js","updatecustomer.js","searchcustomer.js","deleteaccountscustomers.js", "updatetypes.js"];

        let mysql = req.app.get('mysql');
        getAccounts(res, mysql, context, complete);
        getTypes(res, mysql, context, complete)  /*to dynamically generate dropdown for account types*/
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('accounts', context);
            }
        }
    });

    /*Adds an Account, redirects to Accounts page after adding*/
    router.post('/', function (req, res) {
        console.log(req.body)
        
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO accounts (account_type, balance) VALUES(?, ?)";
        let inserts = [req.body.accountType, req.body.balance];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/accounts');
            }
        });
    });

    return router;
}();