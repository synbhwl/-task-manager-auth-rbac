const express = require('express');
const router = express.Router();
require('dotenv').config();

//module imports
const {authmw} = require('../middlewares/authmw');
const {checkRole} = require('../middlewares/rbacmw');
const { readTasks, writeTasks, readusers } = require('../utils/filehelpers');
const { generateid } = require('../utils/idhelper');

// make new task
router.post('/new', authmw, async(req, res)=>{
    const userid = req.user.id;
    const taskid = generateid();
    const {title} = req.body;
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
});

// get all tasks(only for admin)
router.get('/all', authmw, checkRole('admin'), async(req, res)=>{
    const tasks = await readTasks();

    res.status(200).json({message:'all tasks found', tasks:tasks});
});

// get own task
router.get('/own', authmw, async(req, res)=>{
    const userid = req.user.id;

    const tasks = await readTasks();

    const owntasks = tasks.filter(u=> u.userid === userid);

    res.status(200).json({message:'Your tasks found', tasks: owntasks});
});

//get tasks by username(only for admin)
router.get('/users/:username', authmw, checkRole('admin'), async(req, res)=>{
    const username = req.params.username;

    const users = await readusers();

    const user = users.find(u=> u.username === username);
    const userid = user.id;

    const tasks = await readTasks();

    const usertasks = tasks.filter(u=>u.userid === userid);

    res.status(200).json({message:'user tasks are fetched', tasks: usertasks});

});

// deleting a task
router.delete('/:taskid', authmw, async(req, res)=>{
    const taskid = req.params.taskid;
    const tasks = await readTasks();
    const task = tasks.find(t=> t.taskid === taskid);

    if(req.user.role === "admin"){
        const updated = tasks.filter(t=> t.taskid !== taskid);
        await writeTasks(updated)
        res.status(200).json({message:"task deleted", task: task});
    } else if(req.user.role === 'user' && task.userid === req.user.id){
        const updated = tasks.filter(t=> t.taskid !== taskid);
        await writeTasks(updated)
        res.status(200).json({message:"task deleted", task: task});
    };
});

// editing a task
router.patch('/:taskid', authmw, async(req, res)=>{
    const {title, completed} = req.body;
    const taskid = req.params.taskid;
    const tasks = await readTasks()
    const task = tasks.find(t=> t.taskid === taskid);

    if(req.user.role === "admin"){
        task.title = title;
        task.completed = completed;
        await writeTasks(tasks)
        res.status(200).json({message:"task edited", task: task});
    } else if(req.user.role === 'user' && task.userid === req.user.id){
        task.title = title;
        task.completed = completed;
        await writeTasks(tasks)
        res.status(200).json({message:"task edited", task: task});
    };
});

router.get('/:completed', authmw, checkRole('admin'), async(req, res)=>{
    const completed = req.params.completed === 'true';
    const tasks = await readTasks()

    const updated = tasks.filter(t=> t.completed === completed);
    res.status(200).json({message:"tasks with status found", tasks: updated});
});

module.exports = router;