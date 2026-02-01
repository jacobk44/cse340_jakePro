const utilities = require("../utilities/")
const accountModel = require("../models/account-model")



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    description: "Login to your account",
  })
}


// Process login
async function processLogin(req, res) {
  const { account_email, account_password } = req.body

  // 1️⃣ Missing fields
  if (!account_email || !account_password) {
    req.flash("notice", "Please enter both email and password.")
    return res.redirect("/account/login")
  }

  // 2️⃣ Fake example check (replace with DB logic)
  if (account_email !== "test@email.com") {
    req.flash("notice", "Account not found.")
    return res.redirect("/account/login")
  }

  if (account_password !== "password123") {
    req.flash("notice", "Incorrect password.")
    return res.redirect("/account/login")
  }

  // 3️⃣ Success
  req.session.loggedIn = true
  req.flash("notice", "Login successful! Welcome back.")
  res.redirect("/")
}





/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Registration",
    nav,
    errors: null,
    description: "register",
    account_firstname: "", // optional: empty string for stickiness
    account_lastname: "",
    account_email: ""
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      description: "login account"
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      description: "register account"
    })
  }
}


module.exports = { buildLogin, processLogin, buildRegister, registerAccount }