const express = require('express');
const createError = require('http-errors')
const router = express.Router();
const {requireRole} = require('../middlewares/rbacmw');
const { printAllUsernames } = require('../utils/filehelpers');

router.get('/usernames', requireRole('admin'), async (req, res, next)=>{
    try{
        res.status(200).json({
            message:'list of usernames found',
            data: await printAllUsernames()
        });
    }catch(err){
        next(err)
    }
})

module.exports = router;