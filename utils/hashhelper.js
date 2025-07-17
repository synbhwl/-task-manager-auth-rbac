const bcrypt = require('bcryptjs')
const saltrounds = 10

async function hashpass(plain){
    const hashed = await bcrypt.hash(plain, saltrounds);
    return hashed
};

async function checkpass(plain, hashed){
    const ismatch = await bcrypt.compare(plain, hashed);
    return ismatch
};

module.exports = {hashpass, checkpass};