const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
* Registration Data Validation Rules
********************************** */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name.") // on error this message is sent.
      .bail(),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name.") // on error this message is sent.
      .bail(),

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email cannot be empty.")
      .bail()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail() ,

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password must be fill.")
      .bail()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
* Check data and return errors or continue
****************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Register",
      description: "register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  next()
}

module.exports = validate
