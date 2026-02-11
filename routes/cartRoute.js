const express = require("express")
const router = express.Router()
const cartController = require("../controllers/cartController")
const utilities = require("../utilities/")

router.get("/", cartController.viewCart)

router.post("/add", utilities.handleErrors(cartController.addItem))

router.post("/remove", utilities.handleErrors(cartController.removeItem))

module.exports = router