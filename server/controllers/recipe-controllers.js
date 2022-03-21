const axios = require('axios')



const homepage = async (req, res) => {
    // Query api for categories
    let catReq = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );

    let resp = { status: catReq.status, statusmsg: catReq.statusText, type: typeof catReq }
    console.log(resp);

    const categories = catReq.data.categories

    res.render('index', {title:'Homepage', categories})
}

module.exports = {
    homepage,
}