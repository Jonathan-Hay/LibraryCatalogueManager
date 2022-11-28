const Product = require("../models/product.model");

function getNewProduct(req, res) {
  res.render("new-product");
}
async function createNewProduct(req, res) {
  const product = new Product({
    ...req.body,
    // image: req.file.filename,
  });

  console.log(req.body.title);


  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/");}

module.exports = {
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct
  };