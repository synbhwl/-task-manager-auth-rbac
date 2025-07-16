const createError = require("http-errors");

function requireRole(role){
    return (req, res, next)=> {
        try {
            if(!req.user) throw createError(400, 'not logged in')
            const user = req.user;
            const ismatch = user.role === role;
            if(!user || !ismatch) throw createError(403, 'You cannot access this');

            next();
        } catch(err){
            throw err;
        };
    };
};

module.exports = {requireRole}