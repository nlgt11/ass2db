const express = require('express');
const config = require('./config');

const app = express();

const dbconfig = config.dbconfig;

app.set("view engine", "ejs");
//ROUTING
app.use(require('./routes/index'));
app.use('/courses', require('./routes/courses'))


app.listen(config.port, () => {
    console.log(`SERVER RUNNING AT PORT ${config.port}...`)
})