const Product = require("../models/product.model");
const Order = require('../models/order.model');

function getNewProduct(req, res) {
  res.render("new-product");
}
async function createNewProduct(req, res) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
    availability: "Available for Loan"
  });



  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/");
}
  

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("catalogue-admin", { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

async function deleteProduct(req, res, next) {
  let product;
  try {
    //We are deleting an existing product with a given id
    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error);
  }

  //we dont use redirect for ajax, we use json
  res.json({ message: 'Deleted product!' });

}

async function getUpdateBookDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render("admin/update-book-details", { product: product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  });

  //if we have a have a file in the request, replace the old image with the new one
  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render('admin/admin-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  //id is the dynamic path paramter from the id in the url
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getProducts: getProducts,
  deleteProduct: deleteProduct,
  getUpdateBookDetails: getUpdateBookDetails,
  updateProduct: updateProduct,
  getOrders: getOrders,
  updateOrder: updateOrder
  };