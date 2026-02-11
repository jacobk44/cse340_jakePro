const cartModel = require("../models/cart-model")
const { v4: uuidv4 } = require("uuid") // only import once
const utilities = require("../utilities/")

async function addItem(req, res) {
  try {
    let account_id = null
    let session_key = null

    if (req.session.user) {
      account_id = req.session.user.account_id
    } else {
      if (!req.session.guest_id) {
        req.session.guest_id = uuidv4()
      }
      session_key = req.session.guest_id
    }

    const { inv_id } = req.body
    await cartModel.addToCart(account_id, session_key, inv_id, 1)

    req.flash("notice", "Item added to cart")
    res.redirect("back") // 👈 stay on same page
  } catch (error) {
    console.error("ADD ITEM ERROR:", error)
    req.flash("notice", "Could not add item to cart")
    res.redirect("back")
  }
}

async function viewCart(req, res) {
  try {
    let account_id = null
    let session_key = null

    if (req.session.user) {
      account_id = req.session.user.account_id
    } else {
      if (!req.session.guest_id) {
        req.session.guest_id = uuidv4()
      }
      session_key = req.session.guest_id
    }

    const cartItems = await cartModel.getCart(account_id, session_key)
    const nav = await utilities.getNav(req)

    res.render("cart/cart", {
      title: "Your Cart",
      cartItems,
      errors: null,
      nav,
      description: "Review the items in your cart before checkout"
    })
  } catch (error) {
    console.error("VIEW CART ERROR:", error) // full error
    res.status(500).send("Could not load cart")
  }
}


async function cartCount(req, res, next) {
  try {
    let account_id = null;
    let session_key = null;

    if (req.session.user) {
      account_id = req.session.user.account_id;
    } else {
      // assign guest session id if not exist
      if (!req.session.guest_id) req.session.guest_id = uuidv4();
      session_key = req.session.guest_id;
    }

    const count = await cartModel.getCartCount(account_id, session_key);
    res.locals.cartCount = count; // available in all views
    next();
  } catch (err) {
    console.error("CART COUNT MIDDLEWARE ERROR:", err);
    res.locals.cartCount = 0;
    next();
  }
}

async function removeItem(req, res) {
  try {
    const { cart_id } = req.body
    await cartModel.removeFromCart(cart_id)
    res.redirect("/cart")
  } catch (error) {
    console.error("REMOVE ITEM ERROR:", error)
    res.redirect("/cart")
  }
}

module.exports = { addItem, viewCart, removeItem, cartCount }