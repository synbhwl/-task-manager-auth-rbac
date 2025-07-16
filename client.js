const axios = require('axios');

const url = 'http://localhost:3000';

async function register(username, password, role){
    try{
        const res = await axios.post(`${url}/api/auth/register`,{
            username:username,
            password:password,
            role:role
        });

        console.log(res.data.message);
    }catch(err){
        console.error(`error while registering ${err.response.data.message}`)
    };
};

async function login(username, password){
    try{
        const res = await axios.post(`${url}/api/auth/login`,{
            username:username,
            password:password
        });

        console.log(res.data.message);
    }catch(err){
        console.error(`error while login ${err.response.data.message}`)
    };
};

async function getUsernames(){
    try{
        const res = await axios.get(`${url}/api/admin/usernames`);

        console.log(res.data)
    }catch(err){
        console.error(`error while getting usernames ${err.response.data.message}`)
    }
}

async function main(){
    // await register('ishanbhowal@gmail.com', 'talknot123', 'user');
    await login('sayanbhowal@gmail.com', 'whatever123');
    // await login('ishanbhowal@gmail.com', 'talknot123');
    await getUsernames()
};

main()