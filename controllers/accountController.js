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
    errors: null,
    description: "Login to your account",
    account_email: ""
  })
}

async function processLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  // 1️⃣ Find account by email
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Account not found.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      description: "Login to your account",
      account_email,
    })
  }

  // 2️⃣ Check password (plain text for now)
  if (account_password !== accountData.account_password) {
    req.flash("notice", "Incorrect password.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      description: "Login to your account",
      account_email,
    })
  }

  // 3️⃣ Success
  req.session.loggedIn = true
  req.session.accountData = accountData

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
*  Process registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )

    if (regResult && regResult.rowCount === 1) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        description: "login account",
        errors: null,
        account_email: ""
      })
    } else {
      throw new Error("Registration failed.")
    }
  } catch (error) {
    console.error("Registration error:", error)
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      description: "register account",
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}


module.exports = { buildLogin, processLogin, buildRegister, registerAccount }