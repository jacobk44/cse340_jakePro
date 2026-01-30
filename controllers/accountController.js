const utilities = require("../utilities/")


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


// Render registration page
async function buildRegister(req, res, next) {
  const nav = await utilities.getNav()
  res.render("account/signup", {
    title: "Register",
    nav,
    description: "Create a new account"
  })
}



// Process registration
async function processRegister(req, res) {
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  // 1️⃣ Missing fields
  if (!account_firstname || !account_lastname || !account_email || !account_password) {
    req.flash("notice", "Please fill in all required fields.")
    return res.redirect("/account/signup")
  }


  // 4️⃣ Success
  req.flash("notice", "Registration successful! Please log in.")
  res.redirect("/account/login")
}


module.exports = { buildLogin, processLogin, buildRegister, processRegister }