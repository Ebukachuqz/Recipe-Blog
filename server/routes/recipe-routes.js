const express = require("express");
const router = express.Router();
const {
  homepage,
  dashboard,
  getSubmitRecipe,
  submitRecipe,
  search,
  getUserMeal,
  deleteMeal,
  getUpdatePage,
  updateMeal,
} = require("../controllers/Homepage");
const { isAuth } = require("../middleware/authUser");

router.route("/").get(homepage);
router.route("/dashboard").get(isAuth, dashboard);
router.route("/submit-recipe").get(isAuth, getSubmitRecipe).post(submitRecipe);
router.route("/search").post(search);
router.route("/user/meal/:mealID").get(getUserMeal);
router.route("/user/meal/edit/:mealID").get(isAuth, getUpdatePage).patch(updateMeal).delete(deleteMeal);

module.exports = router;
