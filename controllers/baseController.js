const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
  if (!req.session.welcomed) {
    req.flash("notice", "Welcome to our website!")
    req.session.welcomed = true
    return res.redirect("/") // trigger flash read
  }
  const nav = await utilities.getNav(req)
  res.render("index", { title: "Home", nav, description: "Welcome to our home page!" })
}

module.exports = baseController
