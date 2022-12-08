const express = require("express");
const mongodb = require("mongodb");
const Book = require('../models/book.model');


const db = require("../data/database");

const router = express.Router();


router.get('/', function (req, res) {
  res.redirect('/products');
});

//tjese came from products.routes.js
router.get('/products', async function (req, res, next) {
  try {
    const books = await Book.findAll();
    res.render("main-page", { books: books });
  } catch (error) {
    next(error);
  }
});

router.get('/products/:id', async function (req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    res.render('customer/product-details', { book: book });
  } catch (error) {
    next(error);
  }
});




//export the router object for use in index.js
module.exports = router;