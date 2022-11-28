const express = require('express');

const adminController = require('../controllers/admin-controller');



const router = express.Router();


router.get('/products/new', adminController.getNewProduct);
router.post('/products', adminController.createNewProduct);


module.exports = router;