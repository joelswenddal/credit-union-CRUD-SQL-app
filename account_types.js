module.exports = function () {
    var express = require('express');
    var router = express.Router();


    ////////////////////////////
    // FUNCTIONS
    ////////////////////////////

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

    /*Gets just one person for update page*/
    function getOneAccountType(req, res, mysql, context, complete) {
        var query = "SELECT account_type, offer_ID, interest_rate FROM account_types WHERE account_type = ?";
        var inserts = [req.params.account_type];
        mysql.pool.query(query, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }

            context.account_type = results[0];

            console.log(context.account_type.account_type);
            console.log(context.account_type.offer_ID);
            console.log(context.account_type.interest_rate);
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


    /*Initial UPDATE account types redirect off main account_types table UPDATE button on account_types page*/
    router.get('/update/:account_type', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatetypes.js"];

        var mysql = req.app.get('mysql');
        getOneAccountType(req, res, mysql, context, complete);
        getOffers(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('update-types', context);
            }

        }
    });


    /* UPDATE account types. This fn is for updating account type while on the redirected UPDATE page to apply the UPDATE*/
    router.put('/update/:account_type', function (req, res) {
        var mysql = req.app.get('mysql');
        console.log(req.body);
        console.log(req.params.account_type);


        let sql = "UPDATE account_types SET interest_rate=?, offer_ID=? WHERE account_type=?";
        var inserts = [req.body.interestRate, req.body.offerID, req.params.account_type];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        });
    });

    /*Adds an Account Type, redirects to Account Type page after adding*/
    router.post('/', function (req, res) {
        console.log(req.body)
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO account_types (account_type, offer_ID, interest_rate) VALUES (?, ?, ?)";

        if (req.body.offerID === "NULL") {
            nullable = null;
        } else {
            nullable = req.body.offerID;
        }
        let inserts = [req.body.accountType, nullable, req.body.interestRate];
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