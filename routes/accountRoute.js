// const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

/**************************** 
 * Account Route Module
 ****************************/

const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

/**************************
 * Deliver Login View
 **************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.processLogin)
)



/***********************
 Registration View
************************/
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post("/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)


router.get("/", utilities.handleErrors(accountController.buildAccountManagement));




module.exports = router;
