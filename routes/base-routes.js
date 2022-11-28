const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("main-page");
});





//export the router object for use in index.js
module.exports = router;