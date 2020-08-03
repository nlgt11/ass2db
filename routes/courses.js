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

        let courses = result.recordset;
        for (var i = 0; i < courses.length; i++) {
            let result2 = await pool.request()
                .input('Course_id', sql.Int, courses[i].Id)
                .execute('soLearner')
            courses[i].Learner = Object.values(result2.output)[0];
        }
        res.render('courses/index', { courses: result.recordset, moment: moment });

    } catch (err) {
        console.log(err);

    }
});

router.get('/new', (req, res) => {
    res.render('courses/new')
});

router.get('/:id/edit', async (req, res) => {
    try {
        let pool = await sql.connect(dbconfig);
        let result = await pool.request()
                            .query(`SELECT * FROM el.Course WHERE Id=${req.params.id}`);
        //console.log(result);
        console.log(result.recordset[0]);
        res.render('courses/edit', { course: result.recordset[0], moment: moment });

    } catch (err) {
        console.log(err);
    }
});

router.put('/:id', [
    check('course.Course_name', 'Tên đang trống').not().isEmpty(),
    check('course.Price', 'Giá đang trống').not().isEmpty(),
    check('course.HH', 'Thời lượng đang trống').not().isEmpty(),
    check('course.MM', 'Thời lượng đang trống').not().isEmpty(),
    check('course.SS', 'Thời lượng đang trống').not().isEmpty(),
] , async (req, res) => {
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
        const { Course_name, HH, MM, SS, Price, Rating } = req.body.course;
        const Date_created = Date.now();
        try {
            let pool = await sql.connect(dbconfig);
            let result1 = await pool.request()
                                    .input('id', sql.Int, req.params.id)
                                    .input('name', sql.NVarChar(100), Course_name)
                                    .input('price', sql.Float, Price)
                                    .input('length', sql.Time(7), Date(`${HH}:${MM}:${SS}`))
                                    .input('date', sql.Date, Date(Date_created))
                                    .input('rating', sql.Float, Rating)
                                    .execute('el.updateDataToCourse')
            req.flash('success', `Cập nhật thành công khoá học ${Course_name}`)
            res.redirect('/courses');
        } catch (e) {
            req.flash('error', `${e}`)
            console.log(e);
        }
    }

});

router.delete('/:id', async(req, res) => {
    try {
        let pool = await sql.connect(dbconfig);
        let result = await pool.request()
                            .input('id', sql.Int, req.params.id)
                            .execute(`el.deleteDataFromCourse`);
        req.flash('success', 'Xoá khoá học thành công');
        res.redirect('/courses');

    } catch (err) {
        console.log(err);
        req.flash('error', err);
        res.redirect('back');
    }
})
router.post('/:id/search', async (req, res) => {
    try {
        let pool = await sql.connect(dbconfig);
        var start = new Date(req.body.date);
        let courseName = await pool.request().query(`select Course_name from el.Course where Id=${req.params.id}`);
        name = courseName.recordset[0].Course_name;
        let result = await pool.request()
                            .input('Course_id', sql.Int, req.params.id)
                            .input('Date', sql.Date, start)
                            .execute(`layTheory`);
        console.log(result);
        res.render('courses/detail', { courseName: name, courseId: req.params.id, theories: result.recordset, moment: moment });

    } catch (e) {
        req.flash('error', `${e}`)
        console.log(e);
    }

});
router.get('/:id', async (req, res) => {
    try {
        let pool = await sql.connect(dbconfig);
        var start = new Date();
        start.setHours(0,0,0,0);
        let courseName = await pool.request().query(`select Course_name from el.Course where Id=${req.params.id}`);
        name = courseName.recordset[0].Course_name;
        let result = await pool.request()
                            .input('Course_id', sql.Int, req.params.id)
                            .input('Date', sql.Date, start)
                            .execute(`layTheory`);
        console.log(result);
        res.render('courses/detail', { courseName: name, courseId: req.params.id, theories: result.recordset, moment: moment });

    } catch (e) {
        req.flash('error', `${e}`)
        console.log(e);
    }
});


router.post('/', [
    check('course.Course_name', 'Tên đang trống').not().isEmpty(),
    check('course.Price', 'Giá đang trống').not().isEmpty(),
    check('course.HH', 'Thời lượng đang trống').not().isEmpty(),
    check('course.MM', 'Thời lượng đang trống').not().isEmpty(),
    check('course.SS', 'Thời lượng đang trống').not().isEmpty(),
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
        const { Course_name, HH, MM, SS, Price, Rating } = req.body.course;
        const Date_created = Date.now();
        try {
            let pool = await sql.connect(dbconfig);
            let result1 = await pool.request()
                                    .input('name', sql.NVarChar(100), Course_name)
                                    .input('price', sql.Float, Price)
                                    .input('length', sql.Time(7), Date(`${HH}:${MM}:${SS}`))
                                    .input('date', sql.Date, Date(Date_created))
                                    .input('rating', sql.Float, Rating)
                                    .execute('el.addDataToCourse')
            req.flash('success', `Thêm thành công khoá học ${Course_name}`)
            res.redirect('/courses');
        } catch (e) {
            req.flash('error', `${e}`)
            console.log(e);
        }
    }

});



module.exports = router;