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
    /*dropdown*/
    function getStates(res, mysql, context, complete) {
        mysql.pool.query("SELECT state FROM customers GROUP BY state",
            function (error, results, fields) {

                if (error) {
                    res.write(JSON.stringify(error));
                    res.end();
                }
                //populates the context
                context.states = results;
                complete();
            });
    }

    /* Find people whose fname starts with a given string in the req 
    function getPeopleWithNameLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.fname LIKE " + mysql.pool.escape(req.params.s + '%');
        console.log(query)
  
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.people = results;
              complete();
          });
      }*/

    /*filter customer function, passes a new customers context onto customer page*/
    function getCustomersByState(req, res, mysql, context, complete){
      var query = "SELECT customer_ID, ssn, first_name, middle_name, last_name, dob, street_address, city, state, zip, phone_number, email FROM customers WHERE state = ?";
      console.log(req.params)
      var inserts = [req.params.state]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.customers = results;
            console.log(context.customers)
            complete();
        });
    }

    /*Display all customers*/
    router.get('/', function (req, res) {

        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecustomer.js","filtercustomers.js"];  //added js script to context to make available for delete
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        getStates(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('customers', context);
            }
        }
    });

    /*Display all people from a given state. Requires web based javascript to delete users with AJAX*/
    router.get('/:state', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecustomer.js","filtercustomers.js"];
        var mysql = req.app.get('mysql');
        getCustomersByState(req,res, mysql, context, complete);
        getStates(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('customers', context);
            }

        }
    });
    
    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    /*router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPeopleWithNameLike(req, res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('people', context);
            }
        }
    });*/


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

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:customer_id', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM customers WHERE customer_ID = ?";
        var inserts = [req.params.customer_id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else {
                res.status(202).end();
            }
        })
    });

    return router;
}();