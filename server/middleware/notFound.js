const notFound = (req, res) => {
    return res.status(404).json({Msg: "Not found"})
}

module.exports = notFound