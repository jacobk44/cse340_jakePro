/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const path = require("path");

const app = express();

/* ***********************
 * View Engine and Template
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

/* ✅ Enable script extraction (correct place) */
app.set("layout extractScripts", true);

/* ***********************
 * Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")));

/* ***********************
 * Test User Middleware
 * Makes `user` available in ALL EJS files
 *************************/
app.use((req, res, next) => {
  // simulate logged-out user
  req.user = null;

  // expose to EJS templates
  res.locals.user = req.user;
  next();
});

/* ***********************
 * Routes
 *************************/
// Index route
app.get("/", function (req, res) {
  res.render("index", {
    title: "Home",
    description: "Home Page"
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
