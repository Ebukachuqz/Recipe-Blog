const axios = require("axios");
const NotFoundError = require("../errors/not-found");


const getCategory = async (req, res) => {
    const category = req.params.category;
    const formattedParam = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    // Get Category Description
    let categoryReq = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const categories = Object.values(categoryReq.data)[0];
    let catInfo = categories.filter(categori => categori.strCategory == formattedParam);
    if (catInfo == "") {
        throw new NotFoundError(`Sorry we do not have a ${formattedParam} category`)
    }
    catInfo = catInfo[0]

    // Get meals in params category
    let categoryMeals = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${formattedParam}`
    );
    categoryMeals = categoryMeals.data.meals

    res.render('category', {title: `${formattedParam}`, categoryMeals, catInfo});
};


const getMeal = async (req, res) => {
  const { mealID } = req.params;
  let mealReq = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );

  if (mealReq.data.meals == null) {
      throw new NotFoundError("Recipe Not Found.")
    }
    
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
};

module.exports = {
  getCategory,
  getMeal,
};
