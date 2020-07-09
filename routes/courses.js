const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const moment = require('moment');

const config = require('../config');
const sql = require('mssql');
const dbconfig = config.dbconfig;

const conn = new sql.ConnectionPool(dbconfig);

router.get("/", (req, res) => {
    
    conn.connect(err => {
        if(err) {
            console.log(err);
            return res.send("ERROR")
        }
        console.log("DB connected");
        const req = new sql.Request(conn);
        req.query("SELECT * FROM el.Course", (err, recordset) => {
            res.render("courses/index", {courses: recordset.recordset, moment: moment});
            conn.close();
        });
    });

})


module.exports = router;