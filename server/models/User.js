const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide Name']
    },

    username: {
        type: String,
        trim: true,
        required: [true, 'Please provide Username'],
        minlength: [3, 'Username should be at least 3 characters'],
        maxlength: [20, 'Username should be at most 20 characters']
    },

    email: {
    type: String,
    required: [true, 'Please provide Email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
    },
    
    password: {
        type: String,
    minlength: [8, 'Password must be at least 8 Characters'],
  },
})

UserSchema.pre('save', async function () {
    if (this.password == null) {
        this.password = null
    } else {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
})

UserSchema.methods.comparePassword = async function (inputPassword) {
    let isMatch
    if (this.password == null) {
        isMatch = false
        return isMatch
    }
    isMatch = await bcrypt.compare(inputPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)