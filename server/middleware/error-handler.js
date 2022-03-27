const { StatusCodes } = require('http-status-codes')


const errorHandler = (err, req, res, next) => {
    // console.log(err.statusCode);

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
      customError.message = `The ${Object.keys(err.keyValue)} already exists, please pick another.`;
      customError.statusCode = 400;
      req.flash('error_flash', customError.message)
      return res.redirect('/register')
    }
    if (err.name === "CastError") {
      customError.message = `No item found with id : ${err.value}`;
      customError.statusCode = 404;
    }
    return res.status(customError.statusCode).json({Message: customError.message});
}



module.exports = errorHandler