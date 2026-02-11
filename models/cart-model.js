const pool = require("../database/")

async function addToCart(account_id, session_key, inv_id, quantity = 1) {
  try {
    let sql, data;

    if (account_id) {
      // Logged-in user
      sql = `
        INSERT INTO cart (account_id, inv_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (account_id, inv_id)
        DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
        RETURNING *;
      `;
      data = await pool.query(sql, [account_id, inv_id, quantity]);
    } else if (session_key) {
      // Guest user
      sql = `
        INSERT INTO cart (session_key, inv_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (session_key, inv_id)
        DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
        RETURNING *;
      `;
      data = await pool.query(sql, [session_key, inv_id, quantity]);
    }

    return data.rows[0];
  } catch (error) {
    console.error("MODEL addToCart ERROR:", error);
    throw error;
  }
}

async function getCart(account_id, session_key) {
  const sql = `
    SELECT c.cart_id, c.quantity,
           i.inv_make, i.inv_model, i.inv_price, i.inv_image, i.inv_thumbnail
    FROM cart c
    JOIN inventory i ON c.inv_id = i.inv_id
    WHERE 
      (c.account_id = $1 AND $1 IS NOT NULL)
      OR
      (c.session_key = $2 AND $1 IS NULL)
  `
  const data = await pool.query(sql, [account_id, session_key])
  return data.rows
}



async function removeFromCart(cart_id) {
  try {
    const sql = `DELETE FROM cart WHERE cart_id = $1`
    await pool.query(sql, [cart_id])
    return true
  } catch (error) {
    console.error("MODEL removeFromCart ERROR:", error.message)
    throw error
  }
}

async function getCartCount(account_id, session_key) {
  try {
    const sql = `
      SELECT COALESCE(SUM(quantity), 0) AS count
      FROM cart
      WHERE 
        (account_id = $1 AND $1 IS NOT NULL)
        OR
        (session_key = $2 AND $1 IS NULL)
    `
    const data = await pool.query(sql, [account_id, session_key])
    return data.rows[0].count
  } catch (error) {
    console.error("getCartCount error:", error.message)
    return 0
  }
}


async function mergeGuestCartToUser(account_id, session_key) {
  try {
    const sql = `
      UPDATE cart
      SET account_id = $1,
          session_key = NULL
      WHERE session_key = $2
    `
    await pool.query(sql, [account_id, session_key])
  } catch (error) {
    console.error("MODEL mergeGuestCartToUser ERROR:", error)
    throw error
  }
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  getCartCount,
  mergeGuestCartToUser
}