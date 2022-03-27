const User = require('../models/User')
const LocalStrategy = require('passport-local').Strategy

const initializePassport = (passport) => {
    const authUser = async (email, password, done) => {
        // check if user exists
        const user = await User.findOne({ email: email })
        if (!user) return done(null, false, { message: 'That email is not registered' })
        
        // check if the password provided is correct
        const correctPassword = await user.comparePassword(password);
        if (!correctPassword) return done(null, false, { message: 'Incorrect Email or Password' })

        // Return User if password is correct
        const authenticatedUser = { id: user.id, email: user.email }
        return done(null, authenticatedUser)
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authUser))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        }).select('-password')
    });
}
module.exports = initializePassport