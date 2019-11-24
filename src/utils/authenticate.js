module.exports = () => (req, res, next) => {
    if(req.isAuthenticated() && req.user != null){
        next()
    } else {
        res.status(401).json({message: "You are not signed in"})
    }
}