const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//ROUTING
app.use(require('./routes/index'));
app.use('/courses', require('./routes/courses'))


app.listen(config.port, () => {
    console.log(`SERVER RUNNING AT PORT ${config.port}...`)
})