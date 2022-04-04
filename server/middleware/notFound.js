const notFound = (req, res) => {
    return res.status(404).render('./errors/404-error')
}

module.exports = notFound