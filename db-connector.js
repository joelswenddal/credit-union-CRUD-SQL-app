// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',

    /* Template for GH push
    user: 'cs340_[onid]',
    password: '',
    database: 'cs340_[onid]'
    */

    user: 'cs340_voandre',
    password: '1986',
    database: 'cs340_voandre'



})

// Export it for use in our application
module.exports.pool = pool;