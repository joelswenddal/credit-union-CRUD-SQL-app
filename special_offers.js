module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getOffers(res, mysql, context, complete) {
        mysql.pool.query("SELECT offer_ID,chequebook,no_fee_transactions,sign_up_bonus FROM special_offers", function (error, results, fields) {

            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //populates the context
            context.special_offers = results;
            complete();
        });
    }

    /*Display all offers*/
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        getOffers(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('special_offers', context);
            }
        }
    });

    /*Adds an offer, redirects to offers page after adding*/
    router.post('/', function (req, res) {
        console.log(req.body)
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO special_offers (chequebook, no_fee_transactions, sign_up_bonus) VALUES (?, ?, ?)";
        let inserts = [req.body.chequebook, req.body.noFeeTransactions, req.body.signUpBonus];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/special_offers');
            }
        });
    });

    return router;
}();