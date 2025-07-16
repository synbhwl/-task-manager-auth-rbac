const bcrypt = require('bcryptjs');

const saltrounds = 10

async function hashpassword(password){ 
    return await bcrypt.hash(password, saltrounds);
};

async function verifypassword(plain, hashed){
    return await bcrypt.compare(plain, hashed)
};

module.exports = { hashpassword, verifypassword }

