const jwt = require('jsonwebtoken')
require('dotenv').config()

function signjwt(username, id){
    return jwt.sign({username:username, id:id}, process.env.secret)
};

function verifyjwt(token){
    return jwt.verify(token, process.env.secret);
};

module.exports = {verifyjwt, signjwt}