const express = require('express')
const router = express.Router()
const {homepage, dashboard, getSubmitRecipe, submitRecipe, search} = require('../controllers/Homepage');
const { isAuth } = require('../middleware/authUser');



router.route('/').get(homepage)
router.route("/dashboard").get(isAuth, dashboard);
router.route("/submit-recipe").get(isAuth, getSubmitRecipe).post(submitRecipe);
router.route("/search").post(search)

module.exports = router