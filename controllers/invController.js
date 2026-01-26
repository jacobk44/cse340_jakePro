const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    description: "Browse our vehicle inventory",
    nav,
    grid,
  })
}

/* ***************************
  *  Build inventory by vehicle view

  * ************************** */

invCont.buildByVehicleId = async function (req, res, next) {
  const inv_id = req.params.inv_Id
  const data = await invModel.getInventoryById(inv_id)
  const detail = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()

  res.render("./inventory/detail",{
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


module.exports = invCont