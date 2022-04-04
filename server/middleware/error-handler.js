const { StatusCodes } = require('http-status-codes')


const errorHandler = (err, req, res, next) => {
    console.log(err);

    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Oops! Something went wrong. Please Try again later."
    }

    // Handling Mongodb Validation Errors
   
    if (err.code && err.code === 11000) {
      customError.message = `The ${Object.keys(err.keyValue)} already exists, please pick another.`;
      customError.statusCode = 400;
      req.flash('error_flash', customError.message)
      return res.redirect('/register')
    }
  
    if (customError.statusCode == 500) {customError.message = "Oops! Something Went wrong on our side. Try Again Later."}
    return res.status(customError.statusCode).render('./errors/error', { customError });
}



module.exports = errorHandler