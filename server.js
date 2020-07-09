const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//ROUTING
app.use(require('./routes/index'));
app.use('/courses', require('./routes/courses'))


app.listen(config.port, () => {
    console.log(`SERVER RUNNING AT PORT ${config.port}...`)
})