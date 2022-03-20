require('dotenv').config()
require('express-async-errors')

// Express imports
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

// DB
const connectDB = require('./server/db/connectDB')


app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(expressLayouts)

app.set('layout', './layout/main')
app.set('view engine', 'ejs')

const recipeRoutes = require('./server/routes/recipe-routes')
app.use('/', recipeRoutes)


const port = process.env.PORT || 4000

const startApp = async () => {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, ()=>console.log(`App is listening on port ${port}`))
}

startApp()