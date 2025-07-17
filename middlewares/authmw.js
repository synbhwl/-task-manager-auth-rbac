require('dotenv').config();

//test imports
const { readusers } = require('../utils/filehelpers');
const { verifyjwt } = require('../utils/jwthelper');

//auth middleware
async function authmw(req, res, next){
    const header = req.headers;
    const token = header['authorization'].split(' ')[1];
    const decoded = verifyjwt(token);

    const users = await readusers()

    const user = users.find(u=>u.username === decoded.username);
    if(user){
        req.user = user;
        next();
    };
};

module.exports = {authmw}