const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlphanumeric()
      .withMessage("Classification name must not contain spaces or special characters.")
  ]
}



validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      message: null,
      description: "build add classification",
    })
  }
  next()
}



validate.addInventoryRules = () => {
  return [
    body("classification_id")
      .isInt()
      .withMessage("Select a valid classification."),

    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Model is required."),

    body("inv_year")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Enter a valid year."),

    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description is required."),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Enter a valid price."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Enter valid miles."),

    body("inv_color")
      .trim()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Color may only contain letters and spaces."),
  ];
};






validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const classificationSelect = await utilities.buildClassificationList();
    const nav = await utilities.getNav();

    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      description: "Add a vehicle to inventory",
      nav,
      classificationSelect,
      errors,
      message: req.flash("notice"),
      ...req.body // keeps all inputs sticky
    });
  }

  next();
};


module.exports = validate