const axios = require('axios');
const url = 'http://localhost:3000';

async function register(username, password, role, admincode){
    try{
        const res = await axios.post(`${url}/api/auth/register`,{
            username:username,
            password:password,
            role:role,
            admincode:admincode
        });

        console.log(res.data.message);
    }catch(err){
        console.error(`register err[client.js] ${err.response.data.message}`)
    };
};

let token = null;
async function login(username, password){
    try{
        const res = await axios.post(`${url}/api/auth/login`,{
            username:username,
            password:password
        });

        console.log(res.data.message);
        token = res.data.token;
    }catch(err){
        console.error(`login err[client.js] ${err.response.data.message}`)
    };
};

async function getUsernames(){
    try{
        const res = await axios.get(`${url}/api/admin/usernames`, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log(res.data)
    }catch(err){
        console.error(`username fetch err[client.js] ${err.response.data.message}`)
    }
};

async function addtask(title){
    try{
        const res = await axios.post(`${url}/api/tasks/new`, {title:title}, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log(res.data)
    }catch(err){
        console.error(`task add err[client.js] ${err.response.data.message}`)
    }
};

async function getalltasks(){
    try{
        const res = await axios.get(`${url}/api/tasks/all`, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log(res.data)
    }catch(err){
        console.error(`all tasks fetch err[client.js] ${err.response.data.message}`)
    }
};

//get own tasks
async function getowntasks(){
    try{
        const res = await axios.get(`${url}/api/tasks/own`, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log(res.data)
    }catch(err){
        console.error(`own tasks fetch err[client.js] ${err.response.data.message}`)
    }
};

// get tasks by username(only admin can)
async function gettasksbyuser(username){
    try{
        const res = await axios.get(`${url}/api/tasks/users/${username}`, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log(res.data)
    }catch(err){
        console.error(`other user tasks fetch err[client.js] ${err.response.data.message}`)
    }
};

async function deletetask(taskid){
    try{
        const res = await axios.delete(`${url}/api/tasks/${taskid}`, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log(res.data)
    }catch(err){
        console.error(`task delete err[client.js] ${err.response.data.message}`)
    }
};

//edit task
async function edittask(taskid, title, completed){
    try{
        const res = await axios.patch(`${url}/api/tasks/${taskid}`, {
            title:title,
            completed:completed
        }, 
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log(res.data)
    }catch(err){
        console.error(`task edit err[client.js] ${err.response.data.message}`)
    }
};

// get tasks by status
async function taskbystatus(completed){
    try{
        const res = await axios.get(`${url}/api/tasks/${completed}`, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log(res.data)
    }catch(err){
        console.error(`tasks by status fetch err[client.js] ${err.response.data.message}`)
    }
};

async function main(){
    // await login('sush@gmail.com', 'sush123');
    // await login('anubhav@gmail.com', 'hmm123');
    // await register('lachit@gmail.com', 'talkwith00');
    // await login('linus@gmail.com', 'linus330');
    // await login('david@gmail.com', 'david007');
    // await register('check@gmail.com', 'yesik132');
    await login('sayanbhowal@gmail.com', 'whatever123');
    // await login('ishanbhowal@gmail.com', 'talknot123');
    // await addtask('error handling is finally done');
    // await getalltasks();
    // await getowntasks();
    // await gettasksbyuser("lachit@gmail.com");
    // await deletetask('788cae16-1dc4-440c-a8c7-7019c7efccca');
    // await edittask('2a6f8294-e5b0-46c1-a136-979ae883b534', 'david is finally an asshole -sayan', true);
    // await edittask('35ee16ea-8de5-4baf-a01f-7279f18f41f8', 'error handling is finally done', true);
    // await edittask('35ee16ea-8de5-4baf-a01f-7279f18f41f8', 'hell yea, error handling is finally done', true);
    // await taskbystatus('false');
};

main()