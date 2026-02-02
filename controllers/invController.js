const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId

    // Get all vehicles for this classification
    const vehicles = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(vehicles)

    // Get the classification name from classification table
    const classificationData = await invModel.getClassificationById(classification_id)
    let className = classificationData ? classificationData.classification_name : "Unknown Classification"

    const nav = await utilities.getNav()

    res.render("./inventory/classification", {
      title: className + " vehicles",
      description: "Browse our vehicle inventory",
      nav,
      grid,
      message: vehicles.length === 0 ? "Sorry, no matching vehicles could be found." : ""
    })
  } catch (error) {
    console.error("Error building classification view:", error)
    next(error)
  }
}


/* ***************************
  *  Build inventory by vehicle view

  * ************************** */

invCont.buildByVehicleId = async function (req, res, next) {
  const inv_id = req.params.inv_Id
  const data = await invModel.getInventoryById(inv_id)
  const detail = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()

  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    description: `Details for ${data.inv_make} ${data.inv_model}`,
    nav,
    detail,
  })



}


// Controller function to intentionally trigger a 500 error
invCont.triggerError = async function (req, res, next) {
  try {
    // Throw an intentional error
    throw new Error("This is an intentional server error for testing")
  } catch (error) {
    next(error) // Passes the error to the global error middleware
  }
}


invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      description: "Manage inventory",
    })
  } catch (error) {
    console.error("Error building management view:", error)
    next(error)
  }
}



/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: null,
    description: "build add classification",
  })
}



/* ****************************************
 *  Process Add Classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  try {
    const addResult = await invModel.addClassification(classification_name)

    if (addResult && addResult.rowCount === 1) {
      // 🔁 rebuild nav so new classification appears immediately
      nav = await utilities.getNav()

      req.flash("notice", "Classification added successfully.")
      return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        message: req.flash("notice"),
        errors: null
      })
    } else {
      throw new Error("Insert failed")
    }

  } catch (error) {
    console.error("Add Classification Error:", error)

    req.flash("notice", "Sorry, adding the classification failed.")
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("notice"),
      errors: null,
      description: classification_name
    })
  }
}



invCont.buildAddInventory = async function (req, res, next) {
  try {
    // 1️⃣ Build classification dropdown
    const classificationSelect = await utilities.buildClassificationList();

    // 2️⃣ Build navigation
    const nav = await utilities.getNav();

    // 3️⃣ Render the view
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      description: "Add a vehicle to inventory",
      nav,
      classificationSelect,
      errors: null,        // No validation errors initially
      message: req.flash("notice"), // For any flash messages
      // Sticky inputs start empty
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: ""
    });
  } catch (error) {
    next(error); // Pass any errors to global error handler
  }
};



/* ****************************************
 *  Process Add Inventory
 * *************************************** */
invCont.addInventory = async function (req, res) {
  const nav = await utilities.getNav()

  // Destructure all form fields
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  // Default images
  const inv_image = "/images/vehicles/no-image.png"
  const inv_thumbnail = "/images/vehicles/no-image-tn.png"

  try {
    const result = await invModel.addInventory({
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail
    })

    if (result === 1) {
      req.flash("notice", "Inventory item added successfully.")
      return res.redirect("/inv/") // redirect to management or inventory home
    }

    throw new Error("Insert failed")

  } catch (error) {
    console.error("Add Inventory Error:", error)

    req.flash("notice", "Sorry, adding the inventory item failed.")

    const classificationSelect =
      await utilities.buildClassificationList(classification_id)

    return res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      description: "Add a vehicle to inventory",
      classificationSelect,
      errors: null,
      // sticky values
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color
    })
  }
}



module.exports = invCont