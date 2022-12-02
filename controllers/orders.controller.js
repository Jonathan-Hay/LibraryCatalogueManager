const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');


async function getOrders(req, res, next) {
  try {
    // Get all the orders for the given user
    const orders = await Order.findAllForUser(res.locals.uid);

    res.render('customer/all-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }


}



async function addOrder(req, res, next) {

  const id = req.body.id;

  let productDocument;
  try {
    productDocument = await Product.findById(id);
  } catch (error) {
    return next(error);
  }

  //if status === Unavailable - currently on Loan...dont go ahead

  //get the user with the given id
  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  
  const order = new Order(productDocument, userDocument);
  //save it to the db
  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  productDocument.updateAvailability("Unavailable - currently on Loan");


  res.redirect('/orders');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
};
