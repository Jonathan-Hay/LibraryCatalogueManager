const Book = require("../models/book.model");
const Order = require("../models/order.model");

function getNewBook(req, res) {
  res.render("new-book");
}
async function createNewBook(req, res) {
  const book = new Book({
    ...req.body,
    image: req.file.filename,
    availability: "Available for Loan",
  });

  try {
    await book.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/");
}

async function getBooks(req, res, next) {
  try {
    const books = await Book.findAll();
    res.render("catalogue-admin", { books: books });
  } catch (error) {
    next(error);
    return;
  }
}

async function deleteBook(req, res, next) {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Deleted book!" });
}

async function getUpdateBookDetails(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    res.render("admin/update-book-details", { book: book });
  } catch (error) {
    next(error);
  }
}

async function updateBook(req, res, next) {
  const book = new Book({
    ...req.body,
    _id: req.params.id,
  });

  if (req.file) {
    book.replaceImage(req.file.filename);
  }

  try {
    await book.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render("admin/admin-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: "Order updated", newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNewBook: getNewBook,
  createNewBook: createNewBook,
  getBooks: getBooks,
  deleteBook: deleteBook,
  getUpdateBookDetails: getUpdateBookDetails,
  updateBook: updateBook,
  getOrders: getOrders,
  updateOrder: updateOrder,
};
