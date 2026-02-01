const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
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


/* ****************************************
*  Process login attempt
* *************************************** */
async function processLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  try {
    // 1️⃣ Get account object
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Account not found.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        description: "Login to your account",
        errors: null,
        account_email,
      })
    }

    // 2️⃣ Compare bcrypt password
    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (!passwordMatch) {
      req.flash("notice", "Incorrect password.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        description: "Login to your account",
        errors: null,
        account_email,
      })
    }

    // 3️⃣ Success
    req.session.loggedIn = true
    req.session.accountData = {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type,
    }

    req.flash("notice", "Login successful! Welcome back.")
    return res.redirect("/")

  } catch (error) {
    console.error("LOGIN ERROR:", error)
    req.flash("notice", "Server error during login.")
    return res.redirect("/account/login")
  }
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

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
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