const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");

// Login
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.processLogin));

// Register
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));

// Logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Account Management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Update Account Page
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));

// Update Account Info
router.post("/update", regValidate.updateAccountRules(), utilities.checkLogin, utilities.handleErrors(accountController.updateAccount));

// Update Password
router.post("/update-password", regValidate.updatePasswordRules(), utilities.checkLogin, utilities.handleErrors(accountController.updatePassword));

module.exports = router;