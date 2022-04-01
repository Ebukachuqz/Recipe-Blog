require('dotenv').config()
require('express-async-errors')

// imports
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const errorHandler = require('./server/middleware/error-handler')
const notFound = require("./server/middleware/notFound");

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const passport = require('passport')
const initializePassport = require('./server/utils/passport-config')
const initializeGooglePassport = require('./server/utils/google-passport-config')
const methodOverride = require('method-override')
const fileUpload = require('express-fileupload')

app.use(express.static('public'))
app.use(expressLayouts)
app.use(express.urlencoded({ extended: true }))

app.use(fileUpload())

initializePassport(passport)
initializeGooglePassport(passport)


app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// flash
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_flash = req.flash('success_flash')
    res.locals.error_flash = req.flash("error_flash");
    res.locals.error = req.flash("error");
    next()
})

//  Save current user in session
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})


// DB
const connectDB = require('./server/db/connectDB')

// Routes
const recipeRoutes = require('./server/routes/recipe-routes')
const categoryRoutes = require('./server/routes/categories')
const usersAuthRoutes = require("./server/routes/usersAuth");

app.use(methodOverride('_method'))
app.use('/', recipeRoutes)
app.use("/", usersAuthRoutes);
app.use('/categories', categoryRoutes)

// Middlewares

app.set('layout', './layout/main')
app.set('view engine', 'ejs')

app.use(errorHandler)
app.use(notFound);


const port = process.env.PORT || 4000

const startApp = async () => {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, ()=>console.log(`App is listening on port ${port}`))
}

startApp()