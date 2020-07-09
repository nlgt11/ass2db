const express = require('express');
const sql = require('mssql');
const config = require('./config');

const app = express();

const dbconfig = config.dbconfig;
const conn = new sql.ConnectionPool(dbconfig);

app.set("view engine", "ejs");

//ROUTING
app.use(require('./routes/index'));
app.use('/courses', require('./routes/courses'))

// app.get("/", (req, res) => {
//     conn.connect(err => {
//         if(err) {
//             console.log(err);
//             return res.send("ERROR")
//         }
//         console.log("DB connected");
//         const req = new sql.Request(conn);
//         req.query("SELECT * FROM el.Course", (err, res) => {
//             console.log(res);
//         });
//     });
//     res.send("Hello from the other sideeee");
// });


app.listen(config.port, () => {
    console.log(`SERVER RUNNING AT PORT ${config.port}...`)
})