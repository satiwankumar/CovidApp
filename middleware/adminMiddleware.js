module.exports = function (req, res, next) {

    //401 unathorized
    //403 forbiddent
    //req.user

    if (req.user.user_type!="ADMINISTRATOR") return res.status(403).send('Access Denied')
    next()


}