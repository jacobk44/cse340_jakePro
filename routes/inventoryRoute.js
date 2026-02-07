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
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)


// Deliver add inventory view
router.get(
  "/add-inventory",
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildAddInventory)
);



// Route for Inventory Management View
router.get(
  "/",
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildManagement)
)

router.get("/getInventory/:classification_id",utilities.checkAdmin, utilities.handleErrors(invController.getInventoryJSON)
)


/* ***************************
 *  Deliver inventory edit view
 * ************************** */
router.get(
  "/edit/:inventory_id",
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildEditInventoryView)
)



/* ***************************
 *  Deliver inventory delete view
 * ************************** */
router.get(
  "/delete/:inventory_id",
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildDeleteInventoryView)
)





router.post(
  "/add-classification",
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.checkAdmin,
  utilities.handleErrors(invController.addClassification)
)


// Process add inventory form
router.post(
  "/add-inventory",
  regValidate.addInventoryRules(),  // server-side validation middleware
  regValidate.checkInventoryData,   // check for validation errors
  utilities.checkAdmin,
  utilities.handleErrors(invController.addInventory) // insert into DB
);



router.post("/update/", regValidate.checkUpdateData,
  utilities.checkAdmin,
  regValidate.addInventoryRules(),
  utilities.handleErrors(invController.updateInventory))



router.post("/delete/", regValidate.checkUpdateData,
  regValidate.addInventoryRules(),
  utilities.checkAdmin,
  utilities.handleErrors(invController.deleteInventory))


module.exports = router;