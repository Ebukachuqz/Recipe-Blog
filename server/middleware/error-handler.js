const { StatusCodes } = require('http-status-codes')


const errorHandler = (err, req, res, next) => {
    console.log(err.statusCode);

    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Oops! Something went wrong. Please Try again later."
    }
    return res.status(customError.statusCode).json({Message: customError.message});
}

module.exports = errorHandler