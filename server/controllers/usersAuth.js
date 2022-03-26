const User = require("../models/User");


const getLoginPage = (req, res) => res.render('login')

const getRegisterPage = (req, res) => res.render("register");

const registerUser = async (req, res) => {
    const user = await User.create({ ...req.body });
    res.redirect('/login')
};

const loginUser = (passport) => {
    return passport.authenticate('local', {
        successRedirect: "/dashboard",
        failureRedirect: "/login"
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