const axios = require('axios')



const homepage = async (req, res) => {
    // Query api for categories
    let catReq = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );

    const categories = catReq.data.categories

    res.render('index', {title:'Homepage', categories})
}

module.exports = {
    homepage,
}