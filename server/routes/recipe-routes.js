const express = require('express')
const router = express.Router()
const {homepage} = require('../controllers/Homepage')



router.route('/').get(homepage)

module.exports = router