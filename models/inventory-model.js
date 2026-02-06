const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get a single classification by classification_id
 * ************************** */
async function getClassificationById(classification_id) {
  try {
    const sql = `SELECT * FROM public.classification WHERE classification_id = $1`
    const data = await pool.query(sql, [classification_id])
    return data.rows[0]  // returns undefined if not found
  } catch (error) {
    console.error("getClassificationById error: " + error)
    return null
  }
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getinventorybyid error " + error
    )
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */

async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *
    `
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return null
  }
}


async function addInventory(invData) {
  const {
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
  } = invData

  const sql = `
    INSERT INTO inventory
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING inv_id;
  `

  try {
    const result = await pool.query(sql, [
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
    ])
    return result.rowCount
  } catch (error) {
    console.error("Add inventory error:", error)
    return 0
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"

    const data = await pool.query(sql, [
      inv_make,       // $1
      inv_model,      // $2
      inv_description,// $3
      inv_image,      // $4
      inv_thumbnail,  // $5
      inv_price,      // $6
      inv_year,       // $7
      inv_miles,      // $8
      inv_color,      // $9
      classification_id, // $10
      inv_id          // $11 ✅ must be last for WHERE clause
    ])

    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


module.exports = { getClassifications, getClassificationById,getInventoryByClassificationId,getInventoryById,addInventory, addClassification,updateInventory };