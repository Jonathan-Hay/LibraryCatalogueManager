const Product = require("../models/product.model");

function getNewProduct(req, res) {
  res.render("new-product");
}
async function createNewProduct(req, res) {
  const product = new Product({
    ...req.body,
    image: req.file.filename
  });

  console.log(req.body.title);


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

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render("admin/update-product", { product: product });
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

module.exports = {
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getProducts: getProducts,
  deleteProduct: deleteProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct
  };