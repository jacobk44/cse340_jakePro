const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountModel = require("../models/account-model")



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav(req)
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    description: "Login to your account",
    account_email: ""
  })
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function processLogin(req, res) {
  let nav = await utilities.getNav(req)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      description: "login account"
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      // Remove password from account data before storing in session
      delete accountData.account_password
      // ✅ SUCCESS FLASH (THIS FIXES IT)
      req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      // Redirect based on account type
      if (accountData.account_type === "Admin") {
        return res.redirect("/inv/")   // go to Inventory Management
      } else {
        return res.redirect("/account/") // normal client
      }
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        description: "login account"
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}







/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav(req)
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
  let nav = await utilities.getNav(req)
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


/* ****************************************
 *  Build account management view
 * ************************************ */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav(req)

  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null,
    description: "Account Management",
  })
}



// Logout account
async function accountLogout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("jwt")
    res.redirect("/")
  })
}




// New function to build the update account view`
async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav(req)

  res.render("account/account-update", {
    title: "Update Account",
    nav,
    errors: null,
    description: "Update your account info",
    accountData: res.locals.accountData, // prefill form
    oldInput: null // no sticky input on initial load
  })
}


// New function to handle account updates
async function updateAccount(req, res) {
  let nav = await utilities.getNav(req);

  // ✅ Use account ID from JWT, not from form
  const account_id = res.locals.account.account_id;

  const { account_firstname, account_lastname, account_email } = req.body;

  // Server-side validation
  const errors = [];
  if (!account_firstname || account_firstname.trim() === "") errors.push({ msg: "First name is required." });
  if (!account_lastname || account_lastname.trim() === "") errors.push({ msg: "Last name is required." });
  if (!account_email || account_email.trim() === "") {
    errors.push({ msg: "Email is required." });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(account_email)) errors.push({ msg: "Invalid email format." });
  }

  // If validation errors exist, re-render form with sticky inputs
  if (errors.length > 0) {
    return res.render("account/account-update", {
      title: "Update Account",
      nav,
      errors,
      description: "Update your account info",
      accountData: res.locals.accountData,
      oldInput: { account_firstname, account_lastname, account_email }
    });
  }

  // No errors: update database
  try {
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);

    if (updateResult.rowCount === 1) {
      // Update JWT cookie with new account data
      const updatedData = {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        account_type: res.locals.accountData.account_type
      };

      const accessToken = jwt.sign(updatedData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600000
      });

      req.flash("notice", "Account updated successfully!");
      return res.render("account/account-update", {
        title: "Update Account",
        nav,
        errors: null,
        description: "Update your account info",
        accountData: updatedData,
        oldInput: null
      });
    } else {
      req.flash("notice", "Update failed, please try again.");
      return res.render("account/account-update", {
        title: "Update Account",
        nav,
        errors: null,
        description: "Update your account info",
        accountData: res.locals.accountData,
        oldInput: { account_firstname, account_lastname, account_email }
      });
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", "Something went wrong.");
    return res.render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
      description: "Update your account info",
      accountData: res.locals.accountData,
      oldInput: { account_firstname, account_lastname, account_email }
    });
  }
}



// New function to handle password update
async function updatePassword(req, res) {
  let nav = await utilities.getNav(req);

  // Use account ID from JWT
  const account_id = res.locals.account.account_id;

  const { account_password, account_password_confirm } = req.body;

  // Ensure both fields exist
  if (!account_password || !account_password_confirm) {
    req.flash("notice", "Both password fields are required.");
    return res.render("account/account-update", {
      title: "Change Password",
      nav,
      accountData: res.locals.accountData,
      errors: null,
      description: "Change your password",
      oldInput: null
    });
  }

  // Check password match
  if (account_password !== account_password_confirm) {
    req.flash("notice", "Passwords do not match.");
    return res.render("account/account-update", {
      title: "Change Password",
      nav,
      accountData: res.locals.accountData,
      errors: null,
      description: "Change your password",
      oldInput: null
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.updatePassword(account_id, hashedPassword);

    if (result.rowCount === 1) {
      req.flash("notice", "Password updated successfully!");
    } else {
      req.flash("notice", "Password update failed.");
    }

    return res.render("account/account-update", {
      title: "Change Password",
      nav,
      accountData: res.locals.accountData,
      errors: null,
      description: "Change your password",
      oldInput: null
    });
  } catch (error) {
    console.error(error);
    req.flash("notice", "Something went wrong.");
    return res.render("account/account-update", {
      title: "Change Password",
      nav,
      accountData: res.locals.accountData,
      errors: null,
      description: "Change your password",
      oldInput: null
    });
  }
}

module.exports = { buildLogin, processLogin, buildRegister, registerAccount, accountLogout, buildUpdateAccount, buildAccountManagement, updateAccount, updatePassword }