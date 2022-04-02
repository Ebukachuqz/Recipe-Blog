const axios = require('axios');
const path = require('path')
const Meal = require('../models/Meal');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const UnauthorizedError = require("../errors/unauthorized");
const NotFoundError = require("../errors/not-found");


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
    instructions: req.body.instructions,
    category: req.body.category,
    videoLink: req.body.videoLink || "",
    image: imageFilename,
    createdBy: req.user.id,
  };

  meal = await Meal.create(meal)
  req.flash('success_flash', 'Meal was submitted successfully')
  return res.redirect('dashboard')
}


const getRandomRecipe = async (req, res) => {
  let mealReq = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/random.php`
  );
    
    mealReq = mealReq.data.meals[0]
    let ingredients = []
    let quantity = []
    let strIngredient =[]

    // get ingredients from object
    Object.entries(mealReq).forEach(([key, value]) => {
        if (key.startsWith("strIngredient") && value != '' && value != null) {
            ingredients.push([value])
        }
    })

    Object.entries(mealReq).forEach(([key, value]) => {
      if (key.startsWith("strMeasure") && value != "" && value != null) {
        quantity.push([value]);
      }
    });

    for (let i = 0; i < ingredients.length; i++) {
        strIngredient.push(quantity[i] + " " + ingredients[i]);
    }

    let meal = {
      mealName: mealReq.strMeal,
      Category: mealReq.strCategory,
      Area: mealReq.strArea,
      Instruction: mealReq.strInstructions,
      MealImage: mealReq.strMealThumb,
      Youtube: mealReq.strYoutube,
        Ingredients: strIngredient
    };
  res.render('meal', {title: "Meals", meal});
}


const exploreUserMeals = async (req, res) => {
    const perPage = 12
    const total = await Meal.countDocuments()
    const pages = Math.ceil(total / perPage)
    const pageNumber = req.query.page || 1
    const startFrom = (pageNumber - 1) * perPage
 
    // get data from mongo DB using pagination
    const meals = await Meal.find({}).sort({ "id": -1 }).skip(startFrom).limit(perPage)
 
  res.render("users-meals", {
        title: 'Users meals',
        "pages": pages,
        "meals": meals,
        "currentPage": pageNumber
    });
}

const search = async (req, res) => {
  let searchtext = req.body.searchtext
  // remove whitespace
  searchtext = searchtext.trim()
  searchtext = searchtext.replace(/\s/g, " ");

  // search in db first
  const dbMeals = await Meal.find({$text: { $search: searchtext }})

  // search Api
  let apiMeals = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchtext}`
  );

  apiMeals = apiMeals.data.meals

  res.render('search', { apiMeals, dbMeals, searchtext })
}

const getUserMeal = async (req, res) => {
  const { mealID } = req.params
  const meal = await Meal.findById(mealID)
  if (!meal) {
    return res.status(StatusCodes.NOT_FOUND)
  }

  res.render('user-meal', {meal})
}


const deleteMeal = async (req, res) => {
  const { mealID } = req.params
  const meal = await Meal.findByIdAndDelete(mealID)
  res.redirect('/dashboard')
}

const getUpdatePage = async (req, res) => {
  const { mealID } = req.params
  const meal = await Meal.findById(mealID)

  // check if meal exists
  if (!meal) {
    throw new NotFoundError('Sorry that meal does not exist.')
  }

  // check if current user owns the post
  if (req.user.id != meal.createdBy) {
    throw new UnauthorizedError('Sorry u do not have access to that post')
  }
  
  res.render('update-meal', { title:'Update Meal', meal })
}

const updateMeal = async (req, res) => {
  const { mealID } = req.params;
  const { mealName, instructions, ingredients, category, videoLink } = req.body
  
  let meal = await Meal.findById(mealID);
  // check all fields are provided
  if (!mealName || !instructions || !ingredients || !category || !videoLink) {
    req.flash('error_flash', 'Please fill all fields')
    return res.redirect(`/user/meal/edit/${mealID}`);
  }
  meal.mealName = mealName
  meal.instructions = instructions
  meal.ingredients = ingredients
  meal.category = category
  meal.videoLink = videoLink

  // Save update to db
  meal = await meal.save()
  req.flash('success_flash', 'Meal was Updated')
  return res.redirect('/dashboard')
}


module.exports = {
    homepage,
    dashboard,
    getSubmitRecipe,
    submitRecipe,
    search,
    getUserMeal,
  deleteMeal,
  getUpdatePage,
  updateMeal,
  exploreUserMeals,
    getRandomRecipe
}