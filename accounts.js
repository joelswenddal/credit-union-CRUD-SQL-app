module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getAccounts(res, mysql, context, complete) {
        mysql.pool.query("SELECT * FROM accounts ", function (error, results, fields) {

            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.accounts = results;
            complete();
        });
    }

    /*Display all accounts*/
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        getAccounts(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
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