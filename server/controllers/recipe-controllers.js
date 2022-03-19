



const homepage = async (req, res) => {
    res.render('index', {title:'Homepage'})
}

module.exports = {
    homepage,
}