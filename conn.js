const sql = require('mssql');
const conn = new sql.ConnectionPool(dbconfig);
conn.connect(err => {
    if(err) {
        console.log('FAILED TO CONNECT TO DATABASE');
        console.log(err);
    } else {
        console.log('DATABASE CONNECTED')
    }
})
