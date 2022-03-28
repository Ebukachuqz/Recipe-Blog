const express = require('express')
const router = express.Router()
const {homepage, dashboard, getSubmitRecipe, submitRecipe} = require('../controllers/Homepage');
const { isAuth } = require('../middleware/authUser');



router.route('/').get(homepage)
router.route("/dashboard").get(isAuth, dashboard);
router.route("/submit-recipe").get(isAuth, getSubmitRecipe).post(submitRecipe);

module.exports = router