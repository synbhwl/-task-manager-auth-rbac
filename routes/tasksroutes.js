const express = require('express');
const createError = require('http-errors');
const router = express.Router();
require('dotenv').config();

//module imports
const {authmw} = require('../middlewares/authmw');
const {checkRole} = require('../middlewares/rbacmw');
const { readTasks, writeTasks, readusers } = require('../utils/filehelpers');
const { generateid } = require('../utils/idhelper');

// make new task
router.post('/new', authmw, async(req, res, next)=>{
    try{
        const userid = req.user.id;
        if(!userid) throw createError(400, 'missing user id');

        const taskid = generateid();

        const {title} = req.body;
        if(!title) throw createError(400, 'missing titles');

        const date = new Date().toLocaleString();

        const task = {
            userid:userid,
            taskid:taskid,
            title:title,
            completed: false,
            date:date
        };

        const tasks = await readTasks();

        tasks.push(task);

        await writeTasks(tasks)

        res.status(201).json({message:'task created', task: task});
    }catch(err){
        next(err)
    }
});

// get all tasks(only for admin)
router.get('/all', authmw, checkRole('admin'), async(req, res, next)=>{
    try {        
        const tasks = await readTasks();

        res.status(200).json({message:'all tasks found', tasks:tasks});
    } catch(err){
        next(err)
    }
});

// get own task
router.get('/own', authmw, async(req, res, next)=>{
    try {        
        const userid = req.user.id;
        if(!userid) throw createError(400, 'missing user id');

        const tasks = await readTasks();

        const owntasks = tasks.filter(u=> u.userid === userid);

        res.status(200).json({message:'Your tasks found', tasks: owntasks});
    } catch(err){
        next(err)
    }
});

//get tasks by username(only for admin)
router.get('/users/:username', authmw, checkRole('admin'), async(req, res, next)=>{
    try {
        const username = req.params.username;
        if(!username) throw createError(400, 'missing username');

        const users = await readusers();

        const user = users.find(u=> u.username === username);
        if(!user) throw createError(404, 'no such user found');

        const userid = user.id;
        if(!userid)throw createError(404, 'no user id found');

        const tasks = await readTasks();

        const usertasks = tasks.filter(u=>u.userid === userid);

        res.status(200).json({message:'user tasks are fetched', tasks: usertasks});
    }catch(err){
        throw(err);
    }
});

// deleting a task
router.delete('/:taskid', authmw, async(req, res, next)=>{
    try {    
        const taskid = req.params.taskid;
        if(!taskid) throw createError(400, 'no user id found');

        const tasks = await readTasks();
        const task = tasks.find(t=> t.taskid === taskid);
        if(!task) throw createError(404, 'task not found')

        if(req.user.role === "admin"){
            const updated = tasks.filter(t=> t.taskid !== taskid);
            await writeTasks(updated)
            res.status(200).json({message:"task deleted", task: task});
        } else if(req.user.role === 'user' && task.userid === req.user.id){
            const updated = tasks.filter(t=> t.taskid !== taskid);
            await writeTasks(updated)
            res.status(200).json({message:"task deleted", task: task});
        };
    } catch(err){
        next(err)
    }
});

// editing a task
router.patch('/:taskid', authmw, async(req, res, next)=>{
    try {    
        const {title, completed} = req.body;

        const taskid = req.params.taskid;
        if(!taskid) throw createError(400, 'missing task id');

        const tasks = await readTasks()
        const task = tasks.find(t=> t.taskid === taskid);
        if(!task) throw createError(404, 'no such task found')

        if(req.user.role === "admin"){
            task.title = title || task.title;
            task.completed = completed;
            await writeTasks(tasks)
            res.status(200).json({message:"task edited", task: task});
        } else if(req.user.role === 'user' && task.userid === req.user.id){
            task.title = title  || task.title;
            task.completed = completed;
            await writeTasks(tasks)
            res.status(200).json({message:"task edited", task: task});
        };
    }catch(err){
        next(err);
    }
});

router.get('/:completed', authmw, checkRole('admin'), async(req, res, next)=>{
    try {    
        const completed = req.params.completed === 'true';
        if(completed === null) throw createError(400, 'missing status of completed')
        const tasks = await readTasks()

        const updated = tasks.filter(t=> t.completed === completed);
        res.status(200).json({message:"tasks with status found", tasks: updated});
    } catch(err){
        next(err);
    }
});

module.exports = router;