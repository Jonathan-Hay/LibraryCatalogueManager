const express = require('express');

const imageUploadMiddleware = require('../middlewares/image-upload');

const adminController = require('../controllers/admin-controller');



const router = express.Router();


router.get('/products/new', adminController.getNewBook);
router.get('/products', adminController.getBooks);

router.post('/products', imageUploadMiddleware, adminController.createNewBook);

router.get('/products/:id', adminController.getUpdateBookDetails);

router.post('/products/:id', imageUploadMiddleware, adminController.updateBook);
// We will use a delete request because we dont want to use a form, we will use ajax
router.delete('/products/:id', adminController.deleteBook);

router.get('/orders', adminController.getOrders);

router.patch('/orders/:id', adminController.updateOrder);

module.exports = router;