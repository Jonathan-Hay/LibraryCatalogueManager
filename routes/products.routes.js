const express = require('express');
const productsController = require('../controllers/products.controller');

const router = express.Router();

// i think these are better though of as customer routes
router.get('/products', productsController.getAllProducts);

router.get('/products/:id', productsController.getProductDetails);

module.exports = router;