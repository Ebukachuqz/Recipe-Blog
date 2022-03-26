const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
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