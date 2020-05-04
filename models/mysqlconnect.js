
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ethos_latest'
});

// open the MySQL connection
connection.connect(error => {
    if (error){
        throw error;
        console.log("Successfully connected to the database.");
    }
});

module.exports = connection;