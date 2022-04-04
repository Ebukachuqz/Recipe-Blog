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
  updateRecipe,
  getRandomRecipe,
  exploreUserMeals,
  about,
} = require("../controllers/main");
const { isAuth } = require("../middleware/authUser");

router.route("/").get(homepage);
router.route("/about").get(about)
router.route("/dashboard").get(isAuth, dashboard);
router.route("/submit-recipe").get(isAuth, getSubmitRecipe).post(isAuth, submitRecipe);
router.route("/search").post(search);
router.route("/user/meal/:mealID").get(getUserMeal);
router
  .route("/user/meal/edit/:mealID")
  .get(isAuth, getUpdatePage)
  .patch(isAuth, updateRecipe)
  .delete(isAuth, deleteMeal);
router.route("/random-recipe").get(getRandomRecipe)
router.route("/user/meals").get(exploreUserMeals)

module.exports = router;
