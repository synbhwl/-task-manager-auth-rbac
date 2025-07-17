const {v4: uuidv4} = require('uuid')

function generateid(){
    const id = uuidv4();
    return id
};

module.exports = {generateid}