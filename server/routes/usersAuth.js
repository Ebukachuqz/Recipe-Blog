const express = require("express");
const {
  getLoginPage,
  getRegisterPage,
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/usersAuth");
const { isLoggedIn } = require("../middleware/authUser");
const router = express.Router();
const passport = require("passport");

router.route("/login").get(isLoggedIn, getLoginPage).post(loginUser(passport));
router.route("/register").get(isLoggedIn, getRegisterPage).post(registerUser);
router.route("/logout").delete(logoutUser);

module.exports = router;
