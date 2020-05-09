
const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'ethos_latest'
// });


var pool = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ethos_latest'
});

// pool.getConnection(res,function(err, connection) {
//
//
//     if(err){
//         var logdata = {"msg":'Server under maintaince',"statuscode":503};
//         res.status(503).json({"data":logdata});
//
//         console.log('sfsdfsdfds');
//     }
//
// });


// // open the MySQL connection
// connection.connect(error => {
//     if (error){
//         // throw error;
//         console.log("Successfully connected to the database.");
//     }else{
//         console.log('asdasd');
//     }
// });

module.exports = pool;