const regValidate = require('../utilities/inventory-validation')



// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")



// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by vehicle view
router.get("/detail/:inv_Id", invController.buildByVehicleId);


// Intentional 500 test route
router.get("/trigger-error", invController.triggerError)

// Deliver add classification view

router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)


// Deliver add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Process add inventory form
router.post(
  "/add-inventory",
  regValidate.addInventoryRules(),  // server-side validation middleware
  regValidate.checkInventoryData,   // check for validation errors
  utilities.handleErrors(invController.addInventory) // insert into DB
);


// Route for Inventory Management View
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)




module.exports = router;