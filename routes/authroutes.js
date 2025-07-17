const express = require('express');
const router = express.Router();
require('dotenv').config();


//test imports
const { readusers, writeUsers } = require('../utils/filehelpers');
const { signjwt } = require('../utils/jwthelper');
const { generateid } = require('../utils/idhelper');
const { hashpass, checkpass } = require('../utils/hashhelper');

//register
router.post('/register', async (req, res)=>{
    const { username, password, role } = req.body;

    const users = await readusers()

    const newUser = {
        username: username,
        password: await hashpass(password),
        role:role,
        id: generateid()
    };

    users.push(newUser);

    await writeUsers(users)

    res.status(200).json({message:`${username} registered`});
});

//login
router.post('/login', async (req, res)=>{
    const { username, password } = req.body;

    const users = await readusers()
    const user = users.find(u=>u.username === username);
    const ismatch = await checkpass(password, user.password);

    const token = signjwt(user.username, user.id);

    if (ismatch && token){
        res.status(200).json({message:`${username} logged in`, token: token});
    }
});




module.exports = router;