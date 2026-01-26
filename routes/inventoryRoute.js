// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by vehicle view
router.get("/detail/:inv_Id", invController.buildByVehicleId);


// Intentional 500 test route
router.get("/trigger-error", invController.triggerError)


module.exports = router;