
const hasProfile = (req, res, next) => {

    if (req.session.currentUser && req.session.currentUser.profile) {
        res.redirect("/profile")
    } else {
        res.redirect("/test-house")
    }
}



module.exports = hasProfile