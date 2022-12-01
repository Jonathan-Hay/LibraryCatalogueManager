const express = require('express');

const ordersController = require('../controllers/orders.controller');

const router = express.Router();

router.post('/', ordersController.addOrder); // i.e /orders cause we specified the filter in app.js
router.get('/', ordersController.getOrders); // /orders



module.exports = router;