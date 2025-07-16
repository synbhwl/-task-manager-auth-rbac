const {body} = require('express-validator');

exports.authValidator = [
    body('username')
        .isEmail().withMessage('invalid email')
        .isLength({max: 50}).withMessage('email too long')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6, max: 12}).withMessage('invalid password length')

];