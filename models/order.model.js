const mongodb = require("mongodb");

const db = require("../data/database");

class Order {
  constructor(book, userData, status = "pending", date, orderId) {
    this.book = book;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);

    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    this.id = orderId;
  }

  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.book,
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
      .collection("orders")
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orders = await db
      .getDb()
      .collection("orders")
      .find({ "userData._id": uid })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection("orders")
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  async save() {
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id);

      await db
        .getDb()
        .collection("orders")
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
      
      const bookId = new mongodb.ObjectId(this.book.id);

      if (this.status === "Approved") {
        await db.getDb().collection("products").updateOne({ _id: bookId }, { $set: { availability: "Currently on Loan"} });
      } else {
        await db.getDb().collection("products").updateOne({ _id: bookId }, { $set: { availability: "Available for Loan"} });
      }



    } else {
      const orderDocument = {
        userData: this.userData,
        book: this.book,
        date: new Date(),
        status: this.status,
      };

      return db.getDb().collection("orders").insertOne(orderDocument);
    }
  }
}

module.exports = Order;
