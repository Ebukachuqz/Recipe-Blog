const User = require("../models/User");
const crypto = require('crypto');
const sendMail = require("../utils/sendMail");


const getLoginPage = (req, res) => res.render('login')

const getRegisterPage = (req, res) => res.render("register");

const registerUser = async (req, res) => {
    const user = await User.create({ ...req.body });
    req.flash('success_flash', 'You have successfully registered, you can login now.')
    res.redirect('/login')
};

const loginUser = (passport) => {
    return passport.authenticate('local', {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true,
    })
}

const logoutUser = (req, res) => {
    req.logout()
    res.redirect('/')
}

const googleSignin = (passport) => {
    return passport.authenticate("google", { scope: ["email", "profile"] });
}

const googleSigninCallback = (passport) => {
    return passport.authenticate("google", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true,
    });
}


// Password reset
const getForgotPasswordPage = async (req, res) => res.render('forgot-password')

const postForgotPasswordPage = async (req, res) => {
    const { email } = req.body
    if (!email) {
        req.flash('error_flash', 'Please Provide an email Address')
        return res.redirect('/forgot-password')
    }

    // check if email is registered
    let user = await User.findOne({ email: email })
    if (!user) {
        req.flash('error_flash', 'Sorry that email is not registered')
        return res.redirect('/forgot-password')
    }

    console.log('retrieved user')
    const token = crypto.randomBytes(25).toString('hex')
    user.passwordResetToken = token
    user.tokenExpiryTime = Date.now() + 900000 //present time plus 15mis
    console.log("set token user");
    user = await user.save()
    console.log("saved user");


    await sendMail(req, token)
    req.flash('success_flash', 'Password reset link has been sent to your email.')
    return res.redirect('/login')

}


const getPasswordResetPage = async (req, res) => {
    const { token } = req.params
    const user = await User.findOne({
      passwordResetToken: token,
      tokenExpiryTime: {$gt: Date.now()},
    });

    if (!user) {
        req.flash('error_flash', 'That token is invalid or expired')
        return res.redirect('/forgot-password')
    }

    res.render('reset-password', {token})
}

const resetPassword = async (req, res) => {
    const { token } = req.params;
    let user = await User.findOne({
      passwordResetToken: token,
      tokenExpiryTime: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error_flash", "That token is invalid or expired");
      return res.redirect("/forgot-password");
    }

    const { password, password2 } = req.body
    if (!password || !password2) {
        req.flash('error_flash', 'Please Fill all fields')
        return res.redirect(`/reset/${token}`)
    }

    if (password != password2) {
      req.flash("error_flash", "Password don't match");
      return res.redirect(`/reset/${token}`);
    }

    // update password
    user.password = password
    user.passwordResetToken = null
    user.tokenExpiryTime = null
    user = await user.save()
    req.flash('success_flash', 'Password reset was sucessful. You can LogIn now.')
    res.redirect('/login')
}

module.exports = {
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
}