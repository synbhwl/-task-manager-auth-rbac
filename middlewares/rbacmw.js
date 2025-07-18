const createError = require('http-errors');

// rbac middleware
function checkRole(role){
    return (req, res, next)=>{
        try {
            const user = req.user;
            if(!user) throw createError(404, 'cannot authorize since user not found')
            if(user){
                if (role === user.role){
                    console.log('user has required role');
                    next();
                } else {
                    throw createError(403, 'not authorized to access')
                };
            };
        } catch(err){
            next(err);
        }
    };
};

module.exports = {checkRole}
