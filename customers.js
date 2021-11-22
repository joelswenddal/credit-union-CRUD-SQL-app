module.exports = function () {
    var express = require('express');
    var router = express.Router();


   ////////////////////////////
    // FUNCTIONS
    ////////////////////////////

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

    /* search customers via text */
    function searchCustomers(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character


        //using using URLSearchParams to pull the params detail to break it into individual params we can pass into the sql query below. Unsure if this is the way to do it
        var URLSearchParams = new URLSearchParams(req.params.details);      //details is the params on the get route for this search
        var individualParam = [];
        for(var value of URLSearchParams.values()) {                    //loop over the values from key/value pairs in the params
            individualParam.append(value)
          }

        var query = "SELECT customer_ID, ssn, first_name, middle_name, last_name, dob, street_address, city, state, zip, phone_number, email FROM customers WHERE first_name LIKE ? AND last_name LIKE ? AND ssn LIKE ? AND dob LIKE ?" ;
        var inserts = [individualParam[0], individualParam[1], individualParam[2], individualParam[3]]              //pulls the individual params by index to insert into query.
        
        console.log(query)
  
        mysql.pool.query(query, inserts, function(error, results, fields){                  //pass the insert var into the query
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.customers = results;                                      // creates new customers context with the selected customer/customers?
              complete();
          });
      }

    /*filter customer function by state, passes a new customers context onto customer page*/
    function getCustomersByState(req, res, mysql, context, complete) {
        if (req.params.state == undefined) {
            var query = "SELECT customer_ID, ssn, first_name, middle_name, last_name, dob, street_address, city, state, zip, phone_number, email FROM customers"
        } else {
            var query = "SELECT customer_ID, ssn, first_name, middle_name, last_name, dob, street_address, city, state, zip, phone_number, email FROM customers WHERE state = ?";
        }
        var inserts = [req.params.state]
        mysql.pool.query(query, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    /*filter customer function by ID, passes a new customer context */
    function getCustomersByID(req, res, mysql, context, complete) {

        var query = "SELECT customer_ID, ssn, first_name, middle_name, last_name, dob, street_address, city, state, zip, phone_number, email FROM customers WHERE customer_ID = ?";
        var inserts = [req.params.id]
        mysql.pool.query(query, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results[0];
            complete();
        });
    }

    ////////////////////////////
    // ROUTES
    ////////////////////////////
    

    /*Display all customers*/
    router.get('/', function (req, res) {

        var callbackCount = 0;
        var context = {};

        context.jsscripts = ["deletecustomer.js","filtercustomers.js","updatecustomer.js","searchcustomer.js"];  //added js script to context to make available for delete

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
    router.get('/:state', function (req, res) {
        var callbackCount = 0;
        var context = {};

        context.jsscripts = ["deletecustomer.js","filtercustomers.js","updatecustomer.js","searchcustomer.js"];

        var mysql = req.app.get('mysql');
        getCustomersByState(req, res, mysql, context, complete);
        getStates(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('customers', context);
            }

        }
    });
  
    /*Search customers by input */
    router.get('/search/:details', function(req, res){

  
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecustomer.js","filtercustomers.js","updatecustomer.js","searchcustomer.js"];               
        searchCustomers(req, res, mysql, context, complete);
        getStates(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('customers', context);
            }
        }
    });



    /*Initial update customer redirect off main customer table UPDATE button on Customers page*/
    router.get('/update/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecustomer.js","filtercustomers.js","updatecustomer.js","searchcustomer.js"];

        var mysql = req.app.get('mysql');
        getCustomersByID(req, res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('update-customer', context);
            }

        }
    });

    /* UPDATE customers. This fn is for updating customer while on the redirected UPDATE page to apply the UPDATE*/
    router.put('/update/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE customers SET first_name=?,middle_name=?,last_name=?,ssn=?,dob=?,street_address=?,city=?,state=?,zip=?,phone_number=?,email=? WHERE customer_ID=?";
        var inserts = [req.body.firstName, req.body.middleName, req.body.lastName,
        req.body.ssn, req.body.dob, req.body.street, req.body.city, req.body.state, req.body.zip,
        req.body.phone, req.body.email, req.params.id];
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