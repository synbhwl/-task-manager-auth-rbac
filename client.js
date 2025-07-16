const axios = require('axios');
const url = 'http://localhost:3000';

async function register(username, password, role){
    try{
        const res = await axios.post(`${url}/api/auth/register`,{
            username:username,
            password:password,
            role:role
        });

        console.log(res.data);
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

async function main(){
    // await register('ishanbhowal@gmail.com', 'talknot123', 'user');
    // await login('anubhav@gmail.com', 'hmm123');
    // await login('lachit@gmail.com', 'talkwith00');
    // await login('linus@gmail.com', 'linus330');
    // await login('david@gmail.com', 'david007');
    // await register('sayanbhowal@gmail.com', 'whatever123', 'admin');
    await login('sayanbhowal@gmail.com', 'whatever123');
    // await login('ishanbhowal@gmail.com', 'talknot123');
    // await getUsernames()
    // await addtask('ask michaelengelo to make a statue out of it');
    // await getalltasks();
    // await getowntasks();
    await gettasksbyuser("lachit@gmail.com");
};

main()