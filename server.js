const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());


//module imports 
const authroutes = require('./routes/authroutes');
const tasksroutes = require('./routes/tasksroutes');

// middlewares
app.use('/api/auth/', authroutes);
app.use('/api/tasks/', tasksroutes);


//server listening
app.listen(process.env.port || 3000, ()=>{
    console.log(`server is working at port ${process.env.port || 3000}`);
});