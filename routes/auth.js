const express = require('express');
const createError = require('http-errors')
const router = express.Router();

const { hashpassword, verifypassword } = require('../utils/hash.js')
const { generateId } = require('../utils/generateId.js')
const { writeUsers, findUser } = require('../utils/filehelpers.js')
const { authValidator } = require('../validators/uservalidator.js')

router.post('/register', authValidator, async (req, res, next)=>{
    try {
        const {username, password, role} = req.body;

        if(!username) throw createError(400, 'missing username');
        if(!password) throw createError(400, 'missing password');

        const newUser = {
            username:username,
            password: await hashpassword(password),
            id: generateId(),
            role:role
        };

        await writeUsers(newUser);
        
        res.status(200).json({message:'user registered successfully'})
    }catch(err){
        next(err);
    };
});

router.post('/login', authValidator, async (req, res, next)=>{
    try {
        const {username, password} = req.body;
        
        if(!username) throw createError(400, 'missing username');
        if(!password) throw createError(400, 'missing password');

        const user = await findUser(username)

        const ismatch = await verifypassword(password, user.password);
        if(!ismatch) throw createError(403, 'wrong password');

        req.session.user = {
            id: user.id,
            role: user.role
        }

        res.status(200).json({message:'user logged in successfully'})
    }catch(err){
        next(err);
    };
});

module.exports = router;