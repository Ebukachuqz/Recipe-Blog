const express = require('express')
const { getLoginPage, getRegisterPage, registerUser } = require('../controllers/usersAuth')
const router = express.Router()


router.route('/login').get(getLoginPage).post()
router.route('/register').get(getRegisterPage).post(registerUser)

module.exports = router