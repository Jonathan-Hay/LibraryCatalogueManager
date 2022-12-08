const mongodb = require("mongodb");

const db = require("../data/database");

class Book {
  //We expect a product data object
  constructor(bookData) {
    this.title = bookData.title;
    this.summary = bookData.summary;
    this.availability = bookData.availability;
    //We want to store product data as an integer, not string. The + converts it.
    this.description = bookData.description;
    this.image = bookData.image; // the name of the image file
    this.updateImageData();
    //When a product is first created it isn't neccessarily in the database so might not have an id (i think)
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

    //if the id already exists, then we are simply updating an existing product (document)
    if (this.id) {
      const bookId = new mongodb.ObjectId(this.id);

      //if the user isn't updating the image, then we delete the productData.image
      // keyvalue pair from the productData object. This means when the document is updated below
      //mongodb wont try to update that key value pair (it will just remain the old image in the database)
      if (!this.image) {
        delete bookData.image;
      }

      //update the product with the gievn id with the new product data
      await db.getDb().collection("products").updateOne(
        { _id: bookId },
        {
          $set: bookData,
        }
      );
      //if no id exists yet, this is a new product and we are creating a new document
    } else {
      await db.getDb().collection("products").insertOne(bookData);
    }
  }

  remove() {
    const bookId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({ _id: bookId });
  }

  //Find any product with this id if it exists
  static async findById(id) {
    let bookId;
    try {
      //try create the mongodb docuent id. This may not exist ans so fail
      bookId = new mongodb.ObjectId(id);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    // At this point it must exist so retreive the product document
    const book = await db
      .getDb()
      .collection("products")
      .findOne({ _id: bookId });

    if (!book) {
      const error = new Error("Could not find product with provided id.");
      error.code = 404;
      throw error;
    }
    //create the product object from the document and return it
    return new Book(book);
  }

  // Find all the prducts in the db
  static async findAll() {
    const books = await db.getDb().collection("products").find().toArray();
    //we want to return an array of the product objects, but right now we have an array of the DOCUMENTS.
    //the map function for arrays can deal with this. We just give it a function telling it out to treat each element
    //of the array, i.e create a product object for it.

    return books.map(function (bookDocument) {
      return new Book(bookDocument);
    });
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  updateImageData() {
    //local path on server
    this.imagePath = `product-data/images/${this.image}`;
    //When you right click and open image in new tab
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  //updating the availability when an order is made
  async updateAvailability(newAvailability) {
    const bookId = new mongodb.ObjectId(this.id);
    await db.getDb().collection("products").updateOne({ _id: bookId }, { $set: { availability: newAvailability } });
    this.availability = newAvailability;
  }
}

module.exports = Book;
