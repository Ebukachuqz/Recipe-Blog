const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error_flash', 'You must be logged In.')
    return res.redirect('/login')
}

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
}

module.exports = {
    isAuth,
    isLoggedIn
}