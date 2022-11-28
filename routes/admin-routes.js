const express = require('express');

const imageUploadMiddleware = require('../middlewares/image-upload');

const adminController = require('../controllers/admin-controller');



const router = express.Router();


router.get('/products/new', adminController.getNewProduct);
router.get('/products', adminController.getProducts);

router.post('/products', imageUploadMiddleware, adminController.createNewProduct);


module.exports = router;