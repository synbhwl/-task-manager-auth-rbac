

function errorhandler(err, req, res, next) {
    const status= err.status || 500;
    res.status(status).json({sucess: false, message: err.message|| 'something went wrong'})
}

module.exports = { errorhandler }