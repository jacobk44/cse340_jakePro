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
router.post("/login", utilities.handleErrors(accountController.processLogin));


router.get("/signup", utilities.handleErrors(accountController.buildRegister));
router.post("/signup", utilities.handleErrors(accountController.processRegister));






module.exports = router;
