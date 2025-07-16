const {v4:uuidv4} = require('uuid');

function generateId(){
    const id = uuidv4();
    return id
}

module.exports = {generateId};