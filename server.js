const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());


//module imports 
const authroutes = require('./routes/authroutes');
const tasksroutes = require('./routes/tasksroutes');
const errormw = require('./middlewares/errormw');

// middlewares
app.use('/api/auth/', authroutes);
app.use('/api/tasks/', tasksroutes);
app.use(errormw);


//server listening
app.listen(process.env.port || 3000, ()=>{
    console.log(`server is working at port ${process.env.port || 3000}`);
});