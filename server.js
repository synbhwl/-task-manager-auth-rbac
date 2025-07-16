const express = require('express');
const sessionmw = require('./middlewares/session')
require('dotenv').config();

const app = express();
app.use(express.json());

//session
app.use(sessionmw);
app.use((req, res, next)=>{
    if(req.session && req.session.user){
        req.user = req.session.user;
    };
    next();
})

//function imports
const {errorhandler} = require('./errors/errors')


// route imports 
const authroutes = require('./routes/auth');
const adminroutes = require('./routes/admin')


// router initialisations
app.use('/api/auth/', authroutes);
app.use('/api/admin/', adminroutes)

// global error handler 
app.use(errorhandler)

app.listen(process.env.port || 3000, ()=>{
    console.log(`server is working at port ${process.env.port || 3000}`);
});