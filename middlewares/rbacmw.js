// rbac middleware
function checkRole(role){
    return (req, res, next)=>{
        const user = req.user;
        if(user){
            if (role === user.role){
                console.log('user has required role');
                next();
            };
        };
    };
};

module.exports = {checkRole}
