const express = require("express");
const {
  getLoginPage,
  getRegisterPage,
  registerUser,
  loginUser,
  logoutUser,
  googleSignin,
  googleSigninCallback,
  getForgotPasswordPage,
  postForgotPasswordPage,
  getPasswordResetPage,
  resetPassword
} = require("../controllers/usersAuth");
const { isLoggedIn } = require("../middleware/authUser");
const router = express.Router();
const passport = require("passport");

router.route("/login").get(isLoggedIn, getLoginPage).post(loginUser(passport));
router.route("/register").get(isLoggedIn, getRegisterPage).post(registerUser);
router.route("/logout").delete(logoutUser);
router.route('/auth/google').get(googleSignin(passport))
router.route("/auth/google/callback").get(googleSigninCallback(passport));
router.route('/forgot-password').get(isLoggedIn, getForgotPasswordPage).post(postForgotPasswordPage)
router.route("/reset/:token").get(isLoggedIn, getPasswordResetPage).post(resetPassword)

module.exports = router;
