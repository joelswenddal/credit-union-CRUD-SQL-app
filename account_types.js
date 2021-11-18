module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getAccountTypes(res, mysql, context, complete) {
        mysql.pool.query("SELECT account_type, offer_ID, interest_rate FROM account_types ", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.account_types = results;
            complete();
        });
    }

    /*dropdown function*/
    function getOffers(res, mysql, context, complete) {
        mysql.pool.query("SELECT offer_ID FROM special_offers", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.offers = results;
            complete();
        });
    }

    /*Display all account types*/
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        getAccountTypes(res, mysql, context, complete);
        getOffers(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('account_types', context);
            }
        }
    });

    /*Adds an Account Type, redirects to Account Type page after adding*/
    router.post('/', function (req, res) {
        console.log(req.body)
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO account_types (account_type, offer_ID, interest_rate) VALUES (?, ?, ?)";
        let inserts = [req.body.accountType, req.body.offerID, req.body.interestRate];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/account_types');
            }
        });
    });

    return router;
}();