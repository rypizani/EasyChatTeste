const mysql = require('mysql2');

require("dotenv").config();

 const  pool = mysql.createPool({
    host:'187.1.138.200',
    user:'rmssystems02',
    password:'rms1977',
    database:'rmssystems02',
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0,

  });

  module.exports = {
    pool,
};