const express = require('express');

const imageUploadMiddleware = require('../middlewares/image-upload');

const adminController = require('../controllers/admin-controller');



const router = express.Router();


router.get('/products/new', adminController.getNewProduct);
router.get('/products', adminController.getProducts);

router.post('/products', imageUploadMiddleware, adminController.createNewProduct);

router.get('/products/:id', adminController.getUpdateProduct);

router.post('/products/:id', imageUploadMiddleware, adminController.updateProduct);
// We will use a delete request because we dont want to use a form, we will use ajax
router.delete('/products/:id', adminController.deleteProduct);

// router.get('/orders', adminController.getOrders);

// router.patch('/orders/:id', adminController.updateOrder);

module.exports = router;