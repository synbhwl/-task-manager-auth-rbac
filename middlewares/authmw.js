require('dotenv').config();
const createError = require('http-errors');

//test imports
const { readusers } = require('../utils/filehelpers');
const { verifyjwt } = require('../utils/jwthelper');

//auth middleware
async function authmw(req, res, next){
    try {
        const header = req.headers;
        if(!header) throw createError(400, 'auth header missing');
        if(!header['authorization'].startsWith('Bearer')) throw createError(401, 'scheme must be bearer');
        
        const token = header['authorization'].split(' ')[1];
        if(!token) throw createError(400, 'token missing from header');
        
        const decoded = verifyjwt(token);
        if(!decoded) throw createError(500, 'invalid token');
        const users = await readusers()

        const user = users.find(u=>u.username === decoded.username);
        if(user){
            req.user = user;
            next();
        } else {
            throw createError(404, 'cannot authenticate since user not found');
        }
    } catch(err){
        next(err)
    }
};

module.exports = {authmw}