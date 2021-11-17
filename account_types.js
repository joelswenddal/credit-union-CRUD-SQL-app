module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getAccountTypes(res, mysql, context, complete) {
        mysql.pool.query("SELECT * FROM account_types ", function (error, results, fields) {

            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.account_types = results;
            complete();
        });
    }

    /*Display all account types*/
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        getAccountTypes(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('account_types', context);
            }
        }
    });

    /*Adds an Account Type, redirects to Account Type page after adding*/
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