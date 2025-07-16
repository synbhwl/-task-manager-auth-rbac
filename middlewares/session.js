const cookieSession = require('cookie-session');

const sessionmw = cookieSession({
    name:'session',
    keys:[process.env.secret]
});

module.exports = sessionmw;