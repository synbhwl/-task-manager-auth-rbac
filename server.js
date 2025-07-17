const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());

//test require
const fs = require('fs')
const {v4: uuidv4} = require('uuid')
const id = uuidv4()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// register
app.post('/api/auth/register', async (req, res)=>{
    const { username, password, role } = req.body;

    const raw = fs.readFileSync('./data/users.json', 'utf8')
    const users = JSON.parse(raw)

    const newUser = {
        username: username,
        password: await bcrypt.hash(password, 10),
        role:role,
        id:id
    };

    users.push(newUser);

    fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2), 'utf8');

    res.status(200).json({message:`${username} registered`});
});

//login
app.post('/api/auth/login', async (req, res)=>{
    const { username, password } = req.body;

    const raw = fs.readFileSync('./data/users.json', 'utf8');
    const users = JSON.parse(raw);
    const user = users.find(u=>u.username === username);
    const ismatch = await bcrypt.compare(password, user.password)

    const token = jwt.sign(
        {
            username: user.username,
            id: user.id
        },
        process.env.secret
    );

    if (ismatch && token){
        res.status(200).json({message:`${username} logged in`, token: token});
    }
});

//auth middleware
function authmw(req, res, next){
    const header = req.headers;
    const token = header['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, process.env.secret);

    const raw = fs.readFileSync('./data/users.json', 'utf8');
    const users = JSON.parse(raw);

    const user = users.find(u=>u.username === decoded.username);
    if(user){
        console.log('user found in auth mw')
        req.user = user;
        next();
    }
};

// rbac middleware
function checkRole(role){
    return (req, res, next)=>{
        const user = req.user;
        if(user){
            if (role === user.role){
                console.log('user has required role');
                next();
            }
        }
    }
}

//get usernames route 
app.get('/api/admin/usernames', authmw, checkRole('admin'), async (req, res)=>{
    const raw = fs.readFileSync('./data/users.json', 'utf8');
    const users = JSON.parse(raw);
    const usernames = users.map(u=>u.username);
    res.status(200).json({message:`usernames found`, data:usernames})
});

// make new task
app.post('/api/tasks/new', authmw, async(req, res)=>{
    const userid = req.user.id;
    const taskid = uuidv4();
    const {title} = req.body;
    const date = new Date().toLocaleString();

    const task = {
        userid:userid,
        taskid:taskid,
        title:title,
        completed: false,
        date:date
    };

    const raw = fs.readFileSync('./data/tasks.json', 'utf8');
    const tasks = JSON.parse(raw);

    tasks.push(task);

    fs.writeFileSync('./data/tasks.json', JSON.stringify(tasks, null, 2), 'utf8');

    res.status(201).json({message:'task created', task: task});
});

// get all tasks(only for admin)
app.get('/api/tasks/all', authmw, checkRole('admin'), (req, res)=>{
    const raw = fs.readFileSync('./data/tasks.json', 'utf8');
    const tasks = JSON.parse(raw);

    res.status(200).json({message:'all tasks found', tasks:tasks});
});

// get own task
app.get('/api/tasks/own', authmw, (req, res)=>{
    const userid = req.user.id;

    const raw = fs.readFileSync('./data/tasks.json', 'utf8');
    const tasks = JSON.parse(raw);

    const owntasks = tasks.filter(u=> u.userid === userid);

    res.status(200).json({message:'Your tasks found', tasks: owntasks});
});

//get tasks by username(only for admin)
app.get('/api/tasks/users/:username', authmw, checkRole('admin'), (req, res)=>{
    const username = req.params.username;

    const raw = fs.readFileSync('./data/users.json', 'utf8');
    const users = JSON.parse(raw);

    const user = users.find(u=> u.username === username);
    const userid = user.id;

    const rawtasks = fs.readFileSync('./data/tasks.json', 'utf8');
    const tasks = JSON.parse(rawtasks);

    const usertasks = tasks.filter(u=>u.userid === userid);

    res.status(200).json({message:'user tasks are fetched', tasks: usertasks});

});

// deleting a task
app.delete('/api/tasks/:taskid', authmw, (req, res)=>{
    const taskid = req.params.taskid;
    const rawtasks = fs.readFileSync('./data/tasks.json', 'utf8');
    const tasks = JSON.parse(rawtasks);
    const task = tasks.find(t=> t.taskid === taskid);

    if(req.user.role === "admin"){
        const updated = tasks.filter(t=> t.taskid !== taskid);
        fs.writeFileSync('./data/tasks.json', JSON.stringify(updated, null, 2), 'utf8');
        res.status(200).json({message:"task deleted", task: task});
    } else if(req.user.role === 'user' && task.userid === req.user.id){
        const updated = tasks.filter(t=> t.taskid !== taskid);
        fs.writeFileSync('./data/tasks.json', JSON.stringify(updated, null, 2), 'utf8');
        res.status(200).json({message:"task deleted", task: task});
    };
});

// editing a task
app.patch('/api/tasks/:taskid', authmw, (req, res)=>{
    const {title, completed} = req.body;
    const taskid = req.params.taskid;
    const rawtasks = fs.readFileSync('./data/tasks.json', 'utf8');
    const tasks = JSON.parse(rawtasks);
    const task = tasks.find(t=> t.taskid === taskid);

    if(req.user.role === "admin"){
        task.title = title;
        task.completed = completed;
        fs.writeFileSync('./data/tasks.json', JSON.stringify(tasks, null, 2), 'utf8');
        res.status(200).json({message:"task edited", task: task});
    } else if(req.user.role === 'user' && task.userid === req.user.id){
        task.title = title;
        task.completed = completed;
        fs.writeFileSync('./data/tasks.json', JSON.stringify(tasks, null, 2), 'utf8');
        res.status(200).json({message:"task edited", task: task});
    };
});

app.get('/api/tasks/:completed', authmw, checkRole('admin'), (req, res)=>{
    const completed = req.params.completed === 'true';
    const rawtasks = fs.readFileSync('./data/tasks.json', 'utf8');
    const tasks = JSON.parse(rawtasks);

    const updated = tasks.filter(t=> t.completed === completed);
    res.status(200).json({message:"tasks with status found", tasks: updated});
});

app.listen(process.env.port || 3000, ()=>{
    console.log(`server is working at port ${process.env.port || 3000}`);
});