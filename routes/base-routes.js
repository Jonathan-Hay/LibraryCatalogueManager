const express = require("express");
const mongodb = require("mongodb");
const Product = require('../models/product.model');


const db = require("../data/database");

const router = express.Router();


router.get('/', function (req, res) {
  res.redirect('/products');
});

//tjese came from products.routes.js
router.get('/products', async function (req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("main-page", { products: products });
  } catch (error) {
    next(error);
  }
});

router.get('/products/:id', async function (req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render('customer/products/product-details', { product: product });
  } catch (error) {
    next(error);
  }
});




//export the router object for use in index.js
module.exports = router;