const User = require("../models/User");


const getLoginPage = (req, res) => res.render('login')

const getRegisterPage = (req, res) => res.render("register");

const registerUser = async (req, res) => {
    const user = await User.create({ ...req.body });
    req.flash('success_flash', 'You have successfully registered, you can login now.')
    res.redirect('/login')
};

const loginUser = (passport) => {
    return passport.authenticate('local', {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true,
    })
}

const logoutUser = (req, res) => {
    req.logout()
    res.redirect('/')
}

module.exports = {
    getLoginPage,
    getRegisterPage,
    registerUser,
    loginUser,
    logoutUser
}