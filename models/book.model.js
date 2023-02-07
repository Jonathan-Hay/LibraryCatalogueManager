const mongodb = require("mongodb");

const db = require("../data/database");

class Book {
  constructor(bookData) {
    this.title = bookData.title;
    this.summary = bookData.summary;
    this.availability = bookData.availability;
    this.description = bookData.description;
    this.image = bookData.image;
    this.updateImageData();

    if (bookData._id) {
      this.id = bookData._id.toString();
    }
  }

  async save() {
    const bookData = {
      title: this.title,
      summary: this.summary,
      description: this.description,
      image: this.image,
      availability: this.availability
    };

    if (this.id) {
      const bookId = new mongodb.ObjectId(this.id);

      if (!this.image) {
        delete bookData.image;
      }

      await db.getDb().collection("products").updateOne(
        { _id: bookId },
        {
          $set: bookData,
        }
      );
    } else {
      await db.getDb().collection("products").insertOne(bookData);
    }
  }

  remove() {
    const bookId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({ _id: bookId });
  }

  static async findById(id) {
    let bookId;
    try {
      bookId = new mongodb.ObjectId(id);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const book = await db
      .getDb()
      .collection("products")
      .findOne({ _id: bookId });

    if (!book) {
      const error = new Error("Could not find product with provided id.");
      error.code = 404;
      throw error;
    }
    return new Book(book);
  }

  static async findAll() {
    const books = await db.getDb().collection("products").find().toArray();

    return books.map(function (bookDocument) {
      return new Book(bookDocument);
    });
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async updateAvailability(newAvailability) {
    const bookId = new mongodb.ObjectId(this.id);
    await db.getDb().collection("products").updateOne({ _id: bookId }, { $set: { availability: newAvailability } });
    this.availability = newAvailability;
  }
}

module.exports = Book;
