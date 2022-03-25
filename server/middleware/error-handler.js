const { StatusCodes } = require('http-status-codes')


const errorHandler = (err, req, res, next) => {
    console.log(err.statusCode);

    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Oops! Something went wrong. Please Try again later."
    }

    // Handling Mongodb Validation Errors
    if (err.name === "ValidationError") {
      customError.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(",");
      customError.statusCode = 400;
    }
    if (err.code && err.code === 11000) {
      customError.message = `${Object.keys(err.keyValue)} already exists, please choose another value`;
      customError.statusCode = 400;
    }
    if (err.name === "CastError") {
      customError.message = `No item found with id : ${err.value}`;
      customError.statusCode = 404;
    }
    return res.status(customError.statusCode).json({Message: customError.message});
}



module.exports = errorHandler