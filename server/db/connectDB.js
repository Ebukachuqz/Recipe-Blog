const mongoose = require('mongoose')

const connectDB = (mongoURI) => {
    return mongoose.connect(mongoURI)
}

module.exports = connectDB