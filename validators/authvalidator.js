const {body} = require('express-validator');

const authvalidator = [
    body('username')
        .isLength({max: 50}).withMessage('username too long')
        .isEmail().withMessage('username must be an email'),
    body('password')
        .isString()
        .isLength({min: 5}).withMessage('passowrd must be atleast 5 characters')
        .matches(/\d/).withMessage('password must include atleast one number')
];

module.exports = {authvalidator}