const fs = require('fs').promises
const path = require('path');
const userspath = path.join(__dirname, '../data/users.json');
const taskspath = path.join(__dirname, '../data/tasks.json');

async function readusers(){
    const raw = await fs.readFile(userspath, 'utf8')
    return JSON.parse(raw)
};

async function writeUsers(users){
    await fs.writeFile(userspath, JSON.stringify(users, null, 2), 'utf8');
};

async function readTasks(){
    const raw = await fs.readFile(taskspath, 'utf8')
    return JSON.parse(raw)
};

async function writeTasks(tasks){
    await fs.writeFile(taskspath, JSON.stringify(tasks, null, 2), 'utf8');
};

module.exports = {readusers, writeUsers, readTasks, writeTasks};
