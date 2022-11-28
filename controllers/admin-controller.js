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

module.exports = {
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getProducts: getProducts
  };