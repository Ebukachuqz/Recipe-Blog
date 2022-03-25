const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");


const getLoginPage = (req, res) => res.render('login')

const getRegisterPage = (req, res) => res.render("register");

const registerUser = async (req, res) => {
    const user = await User.create({ ...req.body });
    res.redirect('/login')
};


const loginUser = async (req, res) => {

}

module.exports = {
    getLoginPage,
    getRegisterPage,
    registerUser
}