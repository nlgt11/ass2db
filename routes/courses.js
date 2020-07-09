const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const moment = require('moment');
const {check,validationResult} = require('express-validator');

const config = require('../config');
const sql = require('mssql');
const dbconfig = config.dbconfig;


router.get('/', async (req, res) => {
    try {
        let pool = await sql.connect(dbconfig);
        let result = await pool.request()
                            .query(`SELECT * FROM el.Course`);

        res.render('courses/index', { courses: result.recordset, moment: moment });

    } catch (err) {
        console.log(err);
    }
});

router.get('/new', (req, res) => {
    res.render('courses/new')
});

router.get('/:id', async (req, res) => {
    try {
        let pool = await sql.connect(dbconfig);
        let result = await pool.request()
                            .query(`SELECT * FROM el.Course`);
        //console.log(result);
        res.render('courses/index', { courses: result.recordset, moment: moment });

    } catch (err) {
        console.log(err);
    }
});

router.post('/', [
    check('req.body.course.Course_name', 'Tên đang trống').not().isEmpty(),
    check('req.body.course.Price', 'Giá đang trống').not().isEmpty(),
    check('req.body.course.HH', 'Thời lượng đang trống').not().isEmpty(),
    check('req.body.course.MM', 'Thời lượng đang trống').not().isEmpty(),
    check('req.body.course.SS', 'Thời lượng đang trống').not().isEmpty(),
] ,async (req, res) => {
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
        var errors = result.errors;
        console.log(errors);
        for (var key in errors) {
            console.log(errors[key].msg);
            req.flash("error", errors[key].msg);
        }
        return res.redirect('/courses/new')
    } else {
        const { Course_name, HH, MM, SS, Price } = req.body.course;
        const Date_created = Date.now();
        try {
            console.log('at leastr i tried')
            let pool = await sql.connect(dbconfig);
            // let result = await pool.request()
            //                         .input('name', sql.NVarChar(100), Course_name)
            //                         .input('price', sql.Float, Price)
            //                         .input('length', sql.Time(7), Date(Length))
            //                         .input('date', sql.Date, Date(Date_created))
            //                         .query(`INSERT INTO el.Course (Course_name, Length, Price, Rating, Date_created) VALUES (@name, @length, @price, 0, @date);`)
            let result1 = await pool.request()
                                    .input('name', sql.NVarChar(100), Course_name)
                                    .input('price', sql.Float, Price)
                                    .input('length', sql.Time(7), Date(`${HH}:${MM}:${SS}`))
                                    .input('date', sql.Date, Date(Date_created))
                                    .input('rating', sql.Int, 0)
                                    .execute('el.addDataToCourse')
            req.flash('success', `Thêm thành công khoá học ${name}`)
            res.redirect('/courses');
        } catch (e) {
            console.log(e);
        }
    }

})



module.exports = router;