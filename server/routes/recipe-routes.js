const express = require('express')
const router = express.Router()
const {homepage, dashboard} = require('../controllers/Homepage');
const { isAuth } = require('../middleware/authUser');



router.route('/').get(homepage)
router.route("/dashboard").get(isAuth, dashboard);

module.exports = router