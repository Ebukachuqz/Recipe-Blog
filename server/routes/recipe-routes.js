const express = require('express')
const router = express.Router()
const {homepage} = require('../controllers/recipe-controllers')



router.route('/').get(homepage)

module.exports = router