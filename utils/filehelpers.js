const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../data/users.json');
const createError = require('http-errors')

function writeUsers(newUser){
    try{
        const raw = fs.readFileSync(usersPath, 'utf8');
        const users = JSON.parse(raw);

        const userExists = users.some(u=>u.username === newUser.username);
        if (userExists) throw createError(400, 'username taken');

        users.push(newUser);

        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf8');
    } catch(err) {
        throw err;
    }
};

function findUser(username){
    try{
        const raw = fs.readFileSync(usersPath, 'utf8');
        const users = JSON.parse(raw);

        const user = users.find(u=>u.username === username);
        if (!user) throw createError(404, 'user not found');

        return user
    } catch(err) {
        throw err;
    }
};

function printAllUsernames(){
    try{
        const raw = fs.readFileSync(usersPath, 'utf8');
        const users = JSON.parse(raw);

        const allUsernames = users.map(u=> u.username)
        return allUsernames
    }catch(err){
        throw err
    }
};


module.exports = {writeUsers, findUser, printAllUsernames}