const axios = require('axios')
const path = require('path')
const Meal = require('../models/Meal');
const User = require('../models/User')


const homepage = async (req, res) => {
    // Query api for categories
    let catReq = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );

  const categories = catReq.data.categories
  const meals = await Meal.find({}).sort({_id: -1}).limit(6)
  res.render('index', { title: 'Homepage', categories, meals })
}


const dashboard = async (req, res) => {
    const userID = req.user._id
    const user = await User.findById(userID).select('-password')
    const userMeals = await Meal.find({createdBy: user._id})
    res.render('dashboard', {user, userMeals})
}

const getSubmitRecipe = (req, res) => res.render('submit-recipe')

const submitRecipe = async (req, res) => {
  let imageFile
  let uploadPath
  let imageFilename
  // check if any files where upload
  if (!req.files || Object.keys(req.files).length == 0) {
    req.flash('error_flash', 'No image was uploaded')
    return res.redirect('/submit-recipe')
  }

  // save file to server and get filename to be saved in db
  imageFile = req.files.image
  imageFilename = Date.now() + imageFile.name
  uploadPath = path.resolve('./') + '/public/uploads/' + imageFilename

  imageFile.mv(uploadPath, function (err) {
    if (err) {
      return err
      }
  })

  // save recipe to db
  let meal = {
    mealName: req.body.mealName,
    ingredients: req.body.ingredients,
    category: req.body.category,
    videoLink: req.body.videoLink || '',
    image: imageFilename,
    createdBy: req.user.id
  }

  meal = await Meal.create(meal)
  req.flash('success_flash', 'Meal was submitted successfully')
  return res.redirect('dashboard')
}

module.exports = {
    homepage,
    dashboard,
    getSubmitRecipe,
    submitRecipe
}