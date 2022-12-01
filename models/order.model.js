const mongodb = require('mongodb');

const db = require('../data/database');

class Order {
  // To make an order, we need the cart, we need the user data for shipping etc, default status of order will be pending, 
  //and need an order id, date
  // Status => pending, fulfilled, cancelled
  constructor(title, userData, status = 'pending', date, orderId) {
    this.title = title;
    this.userData = userData;
    this.status = status;
    //The data property wont exist initially, when the order is first created 
    this.date = new Date(date);
    // If the date exists, format it
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    this.id = orderId;
  }

  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.title,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection('orders')
      .find()
      // sort by id in decending order, so latest orders are on top
      .sort({ _id: -1 })
      .toArray();

    //transform them into instances of the order class
    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  // We can be updating an existing order, or creatingn a new order alltogethr 
  save() {
    // if id exsists, we are updating
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id);
      return db
        .getDb()
        .collection('orders')
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
      // id not exist, new order
    } else {
      // Create order document and put it into database 
      const orderDocument = {
        userData: this.userData,
        title: this.title,
        // date doesnt exist yet so we crate it, using current time snapshot
        date: new Date(),
        status: this.status,
      };

      return db.getDb().collection('orders').insertOne(orderDocument);
    }
  }
}

module.exports = Order;
