const express = require('express');
const router = express.Router();
require('dotenv').config();
const createError = require('http-errors');


//test imports
const { readusers, writeUsers } = require('../utils/filehelpers');
const { signjwt } = require('../utils/jwthelper');
const { generateid } = require('../utils/idhelper');
const { hashpass, checkpass } = require('../utils/hashhelper');

//register
router.post('/register', async (req, res, next)=>{
    try {    
        const { username, password, role, admincode } = req.body;
        if(!username) throw createError(400, 'cannot register: missing username');
        if(!password) throw createError(400, 'cannot register: missing password');
        
        const defaultRole = "user"
        if(role === 'admin'){
            if(!admincode || admincode !== process.env.admincode) throw createError(403, 'invalid admin code');
        };

        const users = await readusers()
        if(!users) throw createError(500, 'cannot register: Server couldnt fetch data');

        const newUser = {
            username: username,
            password: await hashpass(password),
            role:role || defaultRole,
            id: generateid()
        };

        if(users.some(u=>u.username === username)) throw createError(400, 'user already exists')

        users.push(newUser);

        await writeUsers(users)

        res.status(200).json({message:`${username} registered`});
    }catch(err){
        next(err)
    }
});

//login
router.post('/login', async (req, res, next)=>{
    try {        
        const { username, password } = req.body;
        if(!username) throw createError(400, 'cannot login: missing username');
        if(!password) throw createError(400, 'cannot login: missing password');

        const users = await readusers()

        const user = users.find(u=>u.username === username);
        if(!user) throw createError(404, 'cannot login: no matching user found')

        const ismatch = await checkpass(password, user.password);
        if(!ismatch) throw createError(403, 'cannot login: wrong password')

        const token = signjwt(user.username, user.id);
        if(!token) throw createError(401, 'cannot login: invalid token')


        if (ismatch && token){
            res.status(200).json({message:`${username} logged in`, token: token});
        }
    } catch(err){
        next(err);
    }
});




module.exports = router;